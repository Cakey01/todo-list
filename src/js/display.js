import { Projects } from './projects.js'

export class Display {
    constructor(project) {
        this.project = project;

        // new list dialog
        this.newListDialog = document.getElementById('listDialog');
        this.newListAdd = document.getElementById('newList');
        this.newListName = document.getElementById('listName');
        this.newListSubmit = document.getElementById('listSubmit');
        
        // list names
        this.listUl = document.getElementById('listUl');
        this.lists = document.getElementsByClassName('listItem');

        // header
        this.header = document.getElementById('listHeader');

        // projects
        this.projectsDiv = document.getElementById('projects');
        this.projects = this.projectsDiv.querySelectorAll('button');

        // todos
        this.todoDiv = document.getElementById('todo');
    }
    
    clear() {

    }

    // render

    renderTodos(header, id) {
        this.header.textContent = header;

        if (header && id) {
            this.project.setActive(id);
            const active = this.project.active;
            active.todos.forEach(todo => {
                const div = document.createElement('div')
                div.classList.add('item');
                const check = document.createElement('input');
                check.type = 'checkbox';
                div.appendChild(check);
                const name = document.createElement('h3');
                name.textContent = todo.title;
                div.appendChild(name);
                if (todo.date) {
                    const date = document.createElement('h6');
                    date.textContent = todo.date;
                    div.appendChild(date);
                }
                this.todoDiv.appendChild(div);
            })
        }

        console.log(header, id);
    }

    renderToday() {

    }

    renderCompleted() {

    }

    renderPast() {

    }

    renderLists() {
        // clear
        this.listUl.innerHTML = '';
        const lists = this.project.lists;
        // append each list name
        lists.forEach(list => {
            const listItem = document.createElement('li');
            listItem.classList.add('listItem');
            listItem.textContent = list.name;
            listItem.id = list.id;
            this.listUl.appendChild(listItem);
        });
    }

    // todos

    addTodo() {
         
    }

    expandTodo() {

    }

    editTodo() {

    }

    removeTodo() {

    }

    // lists
    addList(name) {
        this.project.addList(name);
    }

    editList() {

    }

    removeList() {
        
    }

    changeProject() {

    }

    // event listeners

    eventListeners() {
        // add list
        this.newListAdd.addEventListener('click', () => {
            this.newListDialog.showModal();
        });

        // add list: check for input
        this.newListName.addEventListener('input', () => {
            if (this.newListName.value.trim() !== '') {
                this.newListSubmit.disabled = false;
            } else {
                this.newListSubmit.disabled = true;
            }
        });

        // add list: submit
        this.newListSubmit.addEventListener('click', () => {
            this.addList(this.newListName.value.trim());
            this.newListName.value = '';
            this.newListSubmit.disabled = true;
            this.newListDialog.close();
            this.renderLists();
        });

        // lists on click
        this.listUl.addEventListener('click', (e) => {
            const list = e.target.closest('.listItem');
            if (list) {
                const id = list.id;
                this.renderTodos(list.textContent, id);
            }
        });
        
        // projects on click
        this.projects.forEach(project => {
            project.addEventListener('click', () => {
                const header = project.querySelector('.buttonText');
                this.renderTodos(header.textContent);
            })
        })
    }
}