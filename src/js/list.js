import { Todo } from './todo.js';

export class List {
    constructor() {
        this.list = [];
    }

    addTodo(title, description, dueDate, priority) {
        const todo = new Todo(title, description, dueDate, priority);

        this.list.push(todo);
    }
}