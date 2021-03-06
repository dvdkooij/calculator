export class Stack<T> {
  private items: T[];

  constructor(iterable: Iterable<T> = []) {
    this.items = [...iterable];
  }

  pop = () => this.items.pop()
  push = (...items: T[]) => this.items.push(...items)
  peek = () =>
    this.length == 0
      ? undefined
      : this.items[this.length - 1];

  join = () => this.items.join(' ');
  
  get length() {
    return this.items.length;
  }

  *[Symbol.iterator]() {
    for (let item of this.items) yield item;
  }


}