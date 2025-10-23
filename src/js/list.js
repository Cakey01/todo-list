import { Todo } from './todo.js';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo(title, description, dueDate, priority) {
        const todo = new Todo(title, description, dueDate, priority);
        this.todos.push(todo);
    }

    findTodo(id) {
        const found = this.todos.find(todo => todo.id = id);
        return found;
    }
}
