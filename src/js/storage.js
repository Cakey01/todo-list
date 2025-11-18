export class Storage {
    static save(key, values) {
        localStorage.setItem(key, JSON.stringify(values));
    }

    static get(key) {
        const values = localStorage.getItem(key);
        return values ? JSON.parse(values) : []; 
    }
}