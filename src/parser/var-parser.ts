import readByChar from 'read-by-char';

import {Stack} from './stack';
import {VarPosition, CommentPosition, DeclarationPosition} from './position';
import {
  BACKSLASH,
  ASTERISK,
  DASH,
  DOUBLE_DASH,
  COLON,
  SPACE,
  CURLY_LEFT,
  CURLY_RIGHT,
  SEMI_COLON,
  V,
  A,
  R,
  PAREN_LEFT,
  PAREN_RIGHT,
  COMMA,
} from './punctuation';

export interface BaseLocation {
  cursor: number;
  line: number;
  column: number;
}

interface Location {
  start: BaseLocation;
  end: BaseLocation;
}

export interface CustomProperty extends Location {
  value: string;
  file: string;
  declaration: boolean;
}

export class VarParser {
  varsFromLastParse: CustomProperty[] = [];
  private vars: CustomProperty[] = [];
  private varPosition = VarPosition.Zero;
  private commentPosition = CommentPosition.Zero;
  private declarationPosition = DeclarationPosition.Zero;
  private blocks = new Stack<number>();
  private multiLineCommentNumber: number | null = null;
  private currentVar = '';
  private currentStart: BaseLocation = {
    cursor: 0,
    line: 0,
    column: 0,
  };

  private currentEnd: BaseLocation = {
    cursor: 0,
    line: 0,
    column: 0,
  };

  private hasDelimiter = false;
  private cursor = 0;
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  walk(): Promise<CustomProperty[]> {
    return new Promise((resolve) => {
      readByChar(this.file, this.parseBits, () => {
        this.resetParser();
        resolve(this.varsFromLastParse);
      });
    });
  }

  private handleComment = (char: string, _column: number, line: number) => {
    switch (this.commentPosition) {
      case CommentPosition.Zero:
        this.commentPosition = CommentPosition.One;
        break;
      case CommentPosition.One:
        if (char === BACKSLASH) {
          this.multiLineCommentNumber = line;
          this.commentPosition = CommentPosition.Two;
        } else if (char === ASTERISK) {
          this.commentPosition = CommentPosition.Two;
        } else {
          this.commentPosition = CommentPosition.Zero;
        }

        break;
      case CommentPosition.Two:
        if (char === ASTERISK) this.commentPosition = CommentPosition.Three;
        break;
      case CommentPosition.Three:
        if (char === BACKSLASH) {
          this.hasDelimiter = true;
          this.commentPosition = CommentPosition.Zero;
        } else {
          this.commentPosition = CommentPosition.Two;
        }
    }
  };

  private handleDeclaration = (char: string, column: number, line: number) => {
    switch (this.declarationPosition) {
      case DeclarationPosition.Zero:
        this.start(line, column);
        this.declarationPosition = DeclarationPosition.One;
        break;
      case DeclarationPosition.One:
        if (char === DASH) {
          this.declarationPosition = DeclarationPosition.Two;
          this.currentVar = DOUBLE_DASH;
        } else {
          this.currentStart = {cursor: 0, line: 0, column: 0};
          this.declarationPosition = DeclarationPosition.Zero;
        }
        break;
      case DeclarationPosition.Two:
        if (char === COLON) {
          this.end(line, column);
          this.vars.push({
            value: this.currentVar,
            file: this.file,
            declaration: true,
            start: this.currentStart,
            end: this.currentEnd,
          });
          this.resetVar();
          this.declarationPosition = DeclarationPosition.Zero;
        } else {
          if (char === SPACE) return;
          this.currentVar += char;
        }
    }
  };

  private handleVar = (char: string, column: number, line: number) => {
    switch (this.varPosition) {
      case VarPosition.Zero:
        if (char === V) this.varPosition = VarPosition.One;
        break;
      case VarPosition.One:
        if (char === A) this.varPosition = VarPosition.Two;
        else this.resetPosition();
        break;
      case VarPosition.Two:
        if (char === R) this.varPosition = VarPosition.Three;
        else this.resetPosition();
        break;
      case VarPosition.Three:
        if (char === PAREN_LEFT) this.varPosition = VarPosition.Four;
        else this.resetPosition();
        break;
      case VarPosition.Four:
        if (char === PAREN_RIGHT) {
          this.consumeVar(line, column);
          this.resetPosition();
        } else if (char === COMMA) {
          this.consumeVar(line, column);
          this.resetPosition();
        } else {
          if (!this.currentVar) this.start(line, column);
          this.consumeChar(char);
        }
    }
  };

  private handleBlock = (char: string) => {
    if (char === CURLY_LEFT) {
      this.blocks.push(1);
    } else {
      this.blocks.pop();
    }

    this.hasDelimiter = true;
  };

  private parseBits = (char: string, column: number, line: number) => {
    const hadMultiLineComment =
      typeof this.multiLineCommentNumber === 'number' &&
      this.multiLineCommentNumber !== line;

    if (hadMultiLineComment) {
      this.hasDelimiter = true;
    }

    const hadDelimiter = this.hasDelimiter;
    if (this.hasDelimiter && char !== SPACE) this.hasDelimiter = false;

    if (hadMultiLineComment) {
      this.multiLineCommentNumber = null;
      this.commentPosition = CommentPosition.Zero;
    }

    if (
      (this.varPosition === VarPosition.Zero &&
        this.commentPosition === CommentPosition.Zero &&
        (char === BACKSLASH || char === ASTERISK)) ||
      this.commentPosition > CommentPosition.Zero
    ) {
      this.handleComment(char, column, line);
    } else if (char === CURLY_LEFT || char === CURLY_RIGHT) {
      this.handleBlock(char);
    } else if (char === SEMI_COLON) {
      this.hasDelimiter = true;
    } else if (
      this.declarationPosition > DeclarationPosition.Zero ||
      (hadDelimiter &&
        this.varPosition === VarPosition.Zero &&
        char === DASH &&
        !this.blocks.isEmpty)
    ) {
      this.handleDeclaration(char, column, line);
    } else {
      this.handleVar(char, column, line);
    }

    this.cursor++;
  };

  private resetPosition() {
    this.varPosition = VarPosition.Zero;
  }

  private consumeVar(line: number, column: number) {
    this.end(line, column);
    this.vars.push({
      value: this.currentVar,
      file: this.file,
      declaration: false,
      start: this.currentStart,
      end: this.currentEnd,
    });
    this.resetVar();
  }

  private resetVar() {
    this.currentVar = '';
    this.currentStart = {cursor: 0, line: 0, column: 0};
    this.currentEnd = {cursor: 0, line: 0, column: 0};
  }

  private consumeChar(char: string) {
    if (char === SPACE) return;
    this.currentVar += char;
  }

  private start(line: number, column: number) {
    this.currentStart = {
      cursor: this.cursor,
      line,
      column,
    };
  }

  private end(line: number, column: number) {
    this.currentEnd = {
      cursor: this.cursor,
      line,
      column,
    };
  }

  private resetParser() {
    this.varsFromLastParse = this.vars;
    this.vars = [];
    this.varPosition = VarPosition.Zero;
    this.commentPosition = CommentPosition.Zero;
    this.declarationPosition = DeclarationPosition.Zero;
    this.blocks = new Stack<number>();
    this.multiLineCommentNumber = null;
    this.resetVar();
    this.hasDelimiter = false;
    this.cursor = 0;
  }
}
