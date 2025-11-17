import { List } from './list.js';
import { Storage } from './storage.js';

export class Projects {
    constructor() {
        this.lists = Storage.get('lists');
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
        Storage.save('lists', this.lists);

        return list.id;
    }

    removeList(id) {
        const index = this.lists.findIndex(list => list.id === id);
        if (index !== -1) {
            this.lists.splice(index, 1);
        }
        Storage.save('lists', this.lists);
    }

    findList(id) {
        return this.lists.find(list => list.id === id);
    }
}