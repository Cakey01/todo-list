import { Todo } from './todo.js';
import { parseISO, isValid , format } from 'date-fns';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    addTodo(title, description, date, time, priority) {
        const todo = new Todo(title, description, date, time, priority);

        // title and description check & trim
        if (!todo.title || !todo.title.trim().length) {
            return;
        }
        todo.title = todo.title.trim();
        todo.description = todo.description.trim();

        // date check & time check if date is valid
        if (todo.date) {
            const date = todo.date;
            const parsedDate = parseISO(todo.date);
            if (isValid(parsedDate)) {
                todo.date = format(parsedDate, 'MM-dd-yyyy');
            }
            if (todo.time) {
                const parsedDateTime = parseISO(`${date}T${todo.time}`);
                if (!isValid(parsedDateTime)) {
                    todo.time = null;
                }
            }
        } else if (!todo.date && todo.time) {
            const date = format(new Date(), 'yyyy-MM-dd');
            console.log(date)
            const parsedDateTime = parseISO(`${date}T${todo.time}`);
            if (isValid(parsedDateTime)) {
                todo.date = format(new Date(), 'MM-dd-yyyy');
            } else {todo.time = null}
            console.log(todo.time);
        }

        // priority check
        if (todo.priority) {
            const accepted = ['none', 'low', 'medium', 'high'];
            if (!accepted.includes(todo.priority)) {
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
