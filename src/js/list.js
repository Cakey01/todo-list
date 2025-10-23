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

    findIndex(id) {
        const found = this.findTodo(id);
        const index = this.todos.indexOf(found);
        return index;
    }

    removeTodo(id) {
        const toRemove = this.findIndex(id);
        this.todos.splice(toRemove, 1);
    }
}
