export class Stack<T> {
  private mainData = [];

  push(item: T) {
    this.mainData.push(item);
  }

  pop() {
    return this.mainData.pop();
  }
}
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.pop()); // 输出 2