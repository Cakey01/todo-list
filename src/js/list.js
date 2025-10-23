import { Todo } from './todo.js';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo(title, description, date, time, priority) {
        const todo = new Todo(title, description, date, time,priority);
        if (!todo.title || !todo.title.trim().length) {
            return;
        }
        todo.title = todo.title.trim();
        this.todos.push(todo);
    }

    findTodo(id) {
        return this.todos.find(todo => todo.id === id);
    }

    removeTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }

}
