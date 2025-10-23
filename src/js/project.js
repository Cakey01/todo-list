import { Todo } from './todo.js';

export class Project {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.list = [];
    }

    addTodo(title, description, dueDate, priority) {
        const todo = new Todo(title, description, dueDate, priority);
        this.list.push(todo);
    }
}
