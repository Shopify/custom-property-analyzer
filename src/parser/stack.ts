export class Stack<T> {
  readonly list: T[];
  private size: number;

  constructor(list?: T[]) {
    this.list = list || [];
    this.size = (list && list.length) || 0;
  }

  push(item: T) {
    this.size++;
    this.list.push(item);
  }

  pop() {
    if (this.size === 0) return null;

    this.size--;
    return this.list.pop();
  }

  get isEmpty() {
    return this.size === 0;
  }

  get length() {
    return this.size;
  }
}
