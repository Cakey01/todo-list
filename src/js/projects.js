import { List } from './list.js';
import { Todo } from './todo.js';
import { Storage } from './storage.js';

export class Projects {
    constructor() {
        // stored lists
        const storageLists = Storage.get('lists');
        
        // map to this.lists
        if (storageLists.length > 0) {
            this.lists = storageLists.map(listItem => {
                // create list
                const list = new List(listItem.name);
                list.id = listItem.id;

                // make todos Todo instances
                list.todos = listItem.todos.map(todoItem => {
                    const todo = new Todo({
                        title: todoItem.title,
                        description: todoItem.description,
                        date: todoItem.date,
                        time: todoItem.time,
                        priority: todoItem.priority
                    });
                    // add id and completed
                    todo.id = todoItem.id;
                    todo.completed = todoItem.completed;
                    return todo;
                });
                return list;
            });
        } else {
            this.lists = [];
        }
    }

    addList(name) {
        // name check and trim
        if (!name || !name.trim()) {
            return;
        }

        // no duplicates
        if (this.lists.some(list => list.name === name.trim())) {
            return;
        }

        // create list and push
        const list = new List(name.trim());
        this.lists.push(list);

        this.saveToStorage();

        return list.id;
    }

    removeList(id) {
        const index = this.lists.findIndex(list => list.id === id);
        if (index !== -1) {
            this.lists.splice(index, 1);
        }

        this.saveToStorage();
    }

    findList(id) {
        return this.lists.find(list => list.id === id);
    }

    saveToStorage() {
        Storage.save('lists', this.lists);
    }
}