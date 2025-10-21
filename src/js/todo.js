export class Todo {
    constructor(title, description, dueDate, property) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.property = property;
        this.completed = false;
        this.id = crypto.randomUUID();
    }
}
