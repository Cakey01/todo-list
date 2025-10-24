import { Todo } from './todo.js';
import { parseISO, isValid , format } from 'date-fns';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo({ title, description, date, time, priority }) {
        // title required before creating todo
        if (!title || !title.trim()) {
            return;
        }

        // trim title and description
        title = title.trim();
        if (description) {
            description = description.trim();
        }

        const todo = new Todo({ title, description, date, time, priority });

        // date check & time check if date is valid
        if (date) {
            const parsedDate = parseISO(todo.date);
            if (isValid(parsedDate)) {
                todo.date = format(parsedDate, 'MM-dd-yyyy');
            } else {
                todo.date = null;
            }
            if (time) {
                const parsedDateTime = parseISO(`${date}T${time}`);
                if (isValid(parsedDateTime)) {
                    todo.time = time;
                } else {
                    todo.time = null;
                }
            }
        } else if (!todo.date && time) {
            date = format(new Date(), 'yyyy-MM-dd');
            const parsedDateTime = parseISO(`${date}T${time}`);
            if (isValid(parsedDateTime)) {
                todo.date = format(new Date(), 'MM-dd-yyyy');
                todo.time = time;
            } else {
            todo.time = null
            }
        }

        // priority check
        if (priority) {
            const accepted = ['none', 'low', 'medium', 'high'];
            if (!accepted.includes(priority)) {
                todo.priority = null;
            }
        } else {
            todo.priority = 'none';
        }

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
            }
        }
    }
}
