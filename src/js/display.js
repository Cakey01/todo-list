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
        this.projects = this.projectsDiv.querySelectorAll('button')
    }
    
    clear() {

    }

    // render

    renderTodos(header) {
        this.header.textContent = header;
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
            }
            this.renderTodos(list.textContent);
        });
        
        // projects on click
        this.projects.forEach(project => {
            project.addEventListener('click', () => {
                const header = project.querySelector('.buttonText').textContent
                this.renderTodos(header);
            })
        })
    }
}