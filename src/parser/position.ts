export enum VarPosition {
  // Without var
  Zero,
  // Located `v`
  One,
  // Located `a`
  Two,
  // Located `r`
  Three,
  // Located `(`
  Four,
  // Located `,`
  Five,
}

export enum CommentPosition {
  // Without comment
  Zero,
  // Located `/`
  One,
  // Located `/` | `*`
  Two,
  // Located `*` for multi-line comments
  Three,
}

export enum DeclarationPosition {
  // Without declaration
  Zero,
  // Located `-`
  One,
  // Located second `-`
  Two,
}
