export class Storage {
    static save(key, value) {
        localStorage.setItem(key, JSON.stringify((value)));
    }

    static get(key) {
        const values = localStorage.getItem(key);
        return values ? JSON.parse(values) : [];
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}