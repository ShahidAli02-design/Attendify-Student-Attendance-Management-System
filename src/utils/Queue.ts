/**
 * Queue Data Structure Implementation (FIFO - First In, First Out)
 * 
 * Used in Attendify for managing Attendance Correction Requests submitted by students.
 * 
 * Concept:
 * - Elements are inserted at the REAR: enqueue()
 * - Elements are processed & removed from the FRONT: dequeue()
 * - Inspection of the next item in line: peek()
 * 
 *               QUEUE (FIFO)
 *       ┌───────────────────────────────────┐
 *       │ Front: Req A → Req B → Req C :Rear│
 *       └───────────────────────────────────┘
 *          ↑ (dequeue)             ↑ (enqueue)
 */
export class Queue<T> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  /**
   * Adds an element to the rear (end) of the queue.
   * Time Complexity: O(1)
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the element at the front (head) of the queue.
   * Follows FIFO order. Returns undefined if queue is empty.
   * Time Complexity: O(n) using array shift (or O(1) with linked nodes)
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift();
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * Time Complexity: O(1)
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0];
  }

  /**
   * Returns true if the queue contains no elements.
   * Time Complexity: O(1)
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the total number of elements currently in the queue.
   * Time Complexity: O(1)
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Returns the front element in the queue.
   */
  getFront(): T | undefined {
    return this.items[0];
  }

  /**
   * Returns the rear element in the queue.
   */
  getRear(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Returns an array representation of the queue items from front to rear.
   */
  toArray(): T[] {
    return [...this.items];
  }

  /**
   * Clears all elements from the queue.
   */
  clear(): void {
    this.items = [];
  }
}
