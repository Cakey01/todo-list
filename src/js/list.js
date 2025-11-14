import { Todo } from './todo.js';
import { parseISO, isValid , format } from 'date-fns';

export class List {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.todos = [];
    }

    checkValues({ title, description, date, time, priority }) {
        // title
        title = (title && title.trim().length) ? title.trim() : null;

        // description
        description = (description && description.trim().length) ? description.trim() : null;

        // date
        
        if (date) {
            let isoDate = parseISO(date);
            date = isValid(isoDate) ? format(isoDate, 'MM-dd-yyyy') : null;
        }

        // time
        if (time) {
            const isoDate = parseISO(date) || format(new Date(), 'yyyy-MM-dd');
            const parsed = parseISO(`${isoDate}T${time}`);
            time = isValid(parsed) ? time : null;
        }

        // priority
        const accepted = ['none', 'low', 'medium', 'high'];
        priority = accepted.includes(priority) ? priority : 'none';


        return { title, description, date, time, priority }
    }

    addTodo(values) {
        const { title, description, date, time, priority } = this.checkValues(values);

        const todo = new Todo({ title, description, date, time, priority });

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

    editTodo(id, values) {
        const todo = this.findTodo(id);

        const { title, description, date, time, priority } = this.checkValues(values);

        todo.title = title;
        todo.description = description;
        todo.date = date;
        todo.time = time;
        todo.priority = priority;
    }
}
