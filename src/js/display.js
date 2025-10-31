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

        // header
        this.header = document.getElementById('listHeader');

        // projects
        this.projectsDiv = document.getElementById('projects');
        this.projects = this.projectsDiv.querySelectorAll('button');

        // todo dialog
        this.newTodoDialog = document.getElementById('todoDialog');
        this.newTodoAdd = document.getElementById('newTodo');
        this.newTodoSubmit = document.getElementById('todoSubmit');
        this.newTodoTitle = document.getElementById('todoTitle');
        this.newTodoDesc = document.getElementById('todoDesc');
        this.newTodoDate = document.getElementById('todoDate');
        this.newTodoTime = document.getElementById('todoTime');
        this.newTodoPri = document.getElementById('todoPri');

        // todos
        this.todoDiv = document.getElementById('todo');
    }
    
    clear(section) {
        section.innerHTML = '';
    }

    // render

    changeHeader(header) {
        this.header.textContent = header;
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.classList.add('item');

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = todo.completed;

        const title = document.createElement('h3');
        title.textContent = todo.title;

        div.append(check, title);

        if (todo.date) {
            const date = document.createElement('h6');
            date.textContent = todo.date;
            div.appendChild(date);
        }

        return div;
    }

    renderTodos(header) {
        this.changeHeader(header);
        this.clear(this.todoDiv);

        this.project.active.todos.forEach(todo => {
            this.todoDiv.appendChild(this.createTodoElement(todo));
        });
    }

    renderAll() {
        console.log(this.project)
        
    }

    renderToday() {

    }

    renderCompleted() {

    }

    renderPast() {

    }

    createListElement(list) {
        const div = document.createElement('div');
        div.classList.add('listItemDiv')

        const listItem = document.createElement('li');
        listItem.classList.add('listItem');
        listItem.id = list.id;
        listItem.textContent = list.name;

        const remove = document.createElement('button');
        remove.classList.add('removeList');
        remove.textContent = 'x'
        remove.dataset.id = list.id;

        div.append(listItem, remove);

        // check if active
        if (this.project.active.id === listItem.id) {
            div.style.backgroundColor = 'aliceblue';
        }
        
        return div;
    }
    renderLists() {
        // clear
        this.clear(this.listUl);

        const lists = this.project.lists;
        // append each list name
        lists.forEach(list => {
            this.listUl.appendChild(this.createListElement(list));
        });
    }

    setActive(id) {
        this.project.setActive(id);
    }

    // todos

    addTodo(title, description, date, time, priority) {
         this.project.active.addTodo({ 
            title: title,
            description: description || null,
            date: date || null,
            time: time || null,
            priority: priority
         });
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

    removeList(id) {
        this.project.removeList(id);
    }

    changeProject() {

    }

    // reset
    resetDialog(dialog) {
        const inputs = dialog.querySelectorAll('input');
        const submit = dialog.querySelector('button[value="default"]');
        inputs.forEach(input => {
            input.value = ''
        });
        submit.disabled = true;
        dialog.close();
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
            // add list
            this.addList(this.newListName.value.trim());
            // switch to list
            this.renderTodos(this.project.active.name);
            // reset dialog
            this.resetDialog(this.newListDialog);
            // render lists
            this.renderLists();
        });

        // add todo
        this.newTodoAdd.addEventListener('click', () => {
            this.newTodoDialog.showModal();
        });

        // add todo: check for title
        this.newTodoTitle.addEventListener('input', () => {
            if (this.newTodoTitle.value.trim() !== '') {
                this.newTodoSubmit.disabled = false;
            } else {
                this.newTodoSubmit.disabled = true;
            }
        });

        // add todo: submit
        this.newTodoSubmit.addEventListener('click', () => {
            const title = this.newTodoTitle.value;
            const desc = this.newTodoDesc.value;
            const date = this.newTodoDate.value;
            const time = this.newTodoTime.value;
            const pri = this.newTodoPri.value;
            this.addTodo(title, desc, date, time, pri);
            this.resetDialog(this.newTodoDialog);
            this.renderTodos(this.project.active.name);
        });

        // lists on click
        this.listUl.addEventListener('click', (e) => {
            const listDiv = e.target.closest('.listItemDiv');
            const remove = e.target.closest('.removeList');
            if (listDiv) {
                const id = listDiv.querySelector('.listItem').id
                this.setActive(id);
                this.renderTodos(this.project.active.name);
                this.renderLists();
            } 
            // handle remove list
            if (remove) {
                const id = remove.dataset.id;
                if (confirm('Delete list?') === true) {
                    this.removeList(id);
                    this.renderLists();
                }
            }
        });
 
        // projects on click
        this.projects.forEach(project => {
            project.addEventListener('click', () => {
                const view = project.dataset.view;
                switch(view) {
                    case 'all': this.renderAll(); break;
                    case 'today': this.renderToday(); break;
                    case 'past': this.renderPast(); break;
                    case 'completed': this.renderCompleted(); break;
                }
            });
        });
        
        // checkbox
        

    }
}