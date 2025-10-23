export class Todo {
    constructor({ title, description = null, date = null, time = null, priority = null }) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.time = time;
        this.priority = priority;
        this.completed = false;
        this.id = crypto.randomUUID();
    }
}
