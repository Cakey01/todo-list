import { Todo } from './todo.js';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo(title, description, date, time, priority) {
        const todo = new Todo(title, description, date, time, priority);
        if (!todo.title || !todo.title.trim().length) {
            return;
        }
        todo.title = todo.title.trim();
        todo.description = todo.description.trim();
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

    updateTodo(id, property, value) {
        const todo = this.findTodo(id);

        if (!todo) return;
        
        // update title
        if (property === 'title' && value.trim().length) {
            todo.title = value.trim();
        } else if (property === 'description') {
            todo.description = value.trim();
        } else if (property === 'date' || property === 'time') {
            todo[property] = value;
        } else if (property === 'priority') {
            const accepted = ['low', 'medium', 'high', 'none']
            if (accepted.includes(value)) {
                todo.priority = value;
            }
        } else if (property === 'completed') {
            if (value === true) {
                todo.completed = true;
                this.removeTodo(todo.id);
            }
        }
    }
}
