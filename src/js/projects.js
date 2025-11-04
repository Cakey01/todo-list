import { List } from './list.js';

export class Projects {
    constructor() {
        this.lists = [];
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

        return list.id;
    }

    removeList(id) {
        const index = this.lists.findIndex(list => list.id === id);
        if (index !== -1) {
            this.lists.splice(index, 1);
        }
    }

    findList(id) {
        return this.lists.find(list => list.id === id);
    }
}