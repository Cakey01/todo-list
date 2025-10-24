import { List } from './list.js';

export class Projects {
    constructor() {
        this.lists = [];
        this.active = null;
    }

    addList(name) {
        // name check and trim
        if (!name || !name.trim()) {
            console.log(`no name or no trimmed name`);
            return;
        }

        // no duplicates
        const listNames = []
        this.lists.forEach(list => {
            listNames.push(list.name);
        });

        if (listNames.includes(name.trim())) {
            return;
        }

        // create list and push
        const list = new List(name.trim());
        this.lists.push(list);
        
        // make active list
        this.active = list;
    }

    setActive(id) {
        const found = this.lists.find(list => list.id === id);
        if (found) {
            this.active = found;
        }
    }

    removeList(id) {
        const index = this.lists.findIndex(list => list.id === id);
        if (index !== -1) {
            this.lists.splice(index, 1);
        }
    }
}