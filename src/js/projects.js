import { List } from './list.js';

export class Projects {
    constructor() {
        this.lists = [];
        this.active = null;
    }

    addList(name) {
        // create list and push
        const list = new List(name);
        this.lists.push(list);
        
        if (!this.active != list) {
            this.active = list;
        }
    }
}