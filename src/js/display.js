import { Projects } from './projects.js';
import { parse, isPast, format } from 'date-fns';

export class Display {
    constructor(project) {
        // project
        this.project = project;

        // list dialog
        this.listDialog = document.getElementById('listDialog');
        this.addListBtn = document.getElementById('addList');
        this.listInputName = document.getElementById('listInputName');
        this.listSubmit = document.getElementById('listSubmit');
        this.listForm = document.getElementById('listForm');
        this.listCancel = listForm.querySelector('button[value="cancel"]');
        this.editListId = null;

        // todo dialog
        this.todoDialog = document.getElementById('todoDialog');
        this.addTodoBtn = document.getElementById('addTodo');
        this.todoSubmit = document.getElementById('todoSubmit');
        this.todoInputTitle = document.getElementById('todoInputTitle');
        this.todoInputDesc = document.getElementById('todoInputDesc');
        this.todoInputDate = document.getElementById('todoInputDate');
        this.todoInputTime = document.getElementById('todoInputTime');
        this.todoInputPri = document.getElementById('todoInputPri');
        this.priSelects = todoInputPri.querySelectorAll('select');
        this.editTodoId = null;

        // lists
        this.listContainer = document.getElementById('listContainer');
        this.activeList = null;

        // todos
        this.todoContainer = document.getElementById('todoContainer');
        this.todoItem = document.querySelectorAll('.todo-item');
        this.activeTodo = null;

        // header
        this.header = document.getElementById('currentView')

        // views
        this.views = document.getElementById('views');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.currentView = 'All';
    }

    //init
    init() {
        this.activeList = null;
        this.activeTodo = null;
        this.addTodoBtn.disabled = true;
        this.renderAll();
        this.renderLists();
    }

    // helpers
    clear(section) {
        section.innerHTML = '';
    }

    showDialog(dialog) {
        if (dialog === this.todoDialog) {
            if (this.editTodoId) {
                const todo = this.find(this.editTodoId).todo;
                // fill inputs
                this.todoInputTitle.value = todo.title;
                this.todoInputDesc.value = todo.description;
                this.todoInputDate.value = todo.date ? format(todo.date, 'yyyy-MM-dd', new Date()) : null;
                this.todoInputTime.value = todo.time;
                
                this.todoInputPri.value = todo.priority;
                this.todoSubmit.disabled = false;
                dialog.showModal();
            } else {
                dialog.showModal();
            }
        } else if (dialog === this.listDialog) {
            if (this.editListId) {
                const list = this.project.findList(this.editListId);
                this.listInputName.value = list.name;
                this.listSubmit.disabled = false;
                dialog.showModal();
            } else {
                dialog.showModal();
            }
        }
    }

    resetDialog(dialog) {
        const inputs = dialog.querySelectorAll('input');
        const select = dialog.querySelector('select');
        const submit = dialog.querySelector('button[value="default"]');

        inputs.forEach(input => {
            input.value = '';
        });
        select.value = 'none';

        submit.disabled = true;
        dialog.close();
    }

    find(id) {
        const list = this.project.lists.find(list => 
            list.todos.some(todo => todo.id === id)
        );

        if (list) {
            const todo = list.findTodo(id);
            return { list, todo };
        }
        return null;
    }

    parse(date, time) {
        if(date && !time) {
            return parse(`${date} 23:59`, 'MM-dd-yyyy HH:mm', new Date());
        } else if (date && time) {
            return parse(`${date} ${time}`, 'MM-dd-yyyy HH:mm', new Date());
        }
    }

    // views
    changeView(view) {
        this.currentView = view;
        this.header.textContent = view;
    }

    refreshView() {
        switch(this.currentView) {
            case 'All': this.renderAll(); break;
            case 'Today': this.renderToday(); break;
            case 'Past': this.renderPast(); break;
            case 'Completed': this.renderCompleted(); break;
            default: this.renderTodos(this.activeList);
        }
    }

    renderAll() {
        const all = this.project.lists;
        this.changeView('All');
        this.clear(this.todoContainer);
        all.forEach(list => {
            if (list.todos.length > 0) {
                const container = document.createElement('div');
                container.classList.add('item-container');

                const name = document.createElement('h2');
                name.textContent = list.name;
                container.appendChild(name);

                list.todos.forEach(todo => {
                    container.appendChild(this.createTodoElement(todo));
                });

                this.todoContainer.appendChild(container);
            }
        })
    }

    renderToday() {
        this.changeView('Today');
        this.clear(this.todoContainer);

        const date = format(new Date(), 'MM-dd-yyyy');

        // find lists with current date todos
        const lists = this.project.lists.filter(list =>
            list.todos.some(todo => todo.date === date)
        )

        if (lists.length !== 0) {
            lists.forEach(list => {
                const container = document.createElement('div');
                container.classList.add('item-container');

                const name = document.createElement('h2');
                name.textContent = list.name;
                container.appendChild(name);

                const todos = list.todos.filter(todo => todo.date === date);

                todos.forEach(todo => container.appendChild(this.createTodoElement(todo)));

                this.todoContainer.appendChild(container);
            });
        }
    }

    renderPast() {
        this.changeView('Past Due');
        this.clear(this.todoContainer);
        
        // find lists with todos past due
        const lists = this.project.lists.filter(list =>
            list.todos.some(todo => isPast(this.parse(todo.date, todo.time)))
        )

        if (lists.length !== 0) {
            lists.forEach(list => {
                const container = document.createElement('div');
                container.classList.add('item-container');

                const name = document.createElement('h2');
                name.textContent = list.name;
                container.appendChild(name);

                const todos = list.todos.filter(todo => isPast(this.parse(todo.date, todo.time)));

                todos.forEach(todo => container.appendChild(this.createTodoElement(todo)));

                this.todoContainer.appendChild(container);
            });
        }
    }

    renderCompleted() {
        this.changeView('Completed');
        this.clear(this.todoContainer);

        // find lists with completed todos
        const completed = this.project.lists.filter(list => 
            list.todos.some(todo => todo.completed === true)
        )

        if (completed.length !== 0) {
            completed.forEach(list => {
                const container = document.createElement('div');
                container.classList.add('item-container');

                const name = document.createElement('h2');
                name.textContent = list.name;
                container.appendChild(name);

                // completed todos
                const todos = list.todos.filter(todo => todo.completed === true);

                todos.forEach(todo => container.appendChild(this.createTodoElement(todo)));

                this.todoContainer.appendChild(container);
            });
        }

    }


    // lists

    setActiveList(id) {
        this.activeList = this.project.findList(id);
    }

    addList(name) {
        this.project.addList(name);
    }

    removeList(id) {
        this.project.removeList(id);
        // change list to first if exists else change to all
        if (this.project.lists[0]) {
            this.setActiveList(this.project.lists[0].id);
            this.renderTodos(this.activeList);
        } else {
            this.renderAll();
            this.addTodoBtn.disabled = true;
        }
    }

    createListElement(list) {
        const container = document.createElement('div');
        container.classList.add('list-item-container');
        container.dataset.id = list.id;

        const item = document.createElement('li');
        item.classList.add('list-item');
        item.textContent = list.name;

        const remove = document.createElement('button');
        remove.classList.add('remove');
        remove.textContent = 'x';

        const edit = document.createElement('button');
        edit.classList.add('edit');
        edit.textContent = 'edit';

        container.append(item, edit, remove);

        // background color if active
        if (this.activeList && this.activeList.id === container.dataset.id) {
            container.classList.add('active-list');
        }

        return container;
    }

    renderLists() {
        this.clear(this.listContainer);

        const lists = this.project.lists;
        lists.forEach(list => {
            this.listContainer.appendChild(this.createListElement(list));
        });
    }

    editList(id, name) {
        const list = this.project.findList(id);
        if (list) {
            list.name = name;
        }
        // save to storage
        this.project.saveToStorage();
    }

    // todos
    setActiveTodo(id) {
        this.activeTodo = this.find(id).todo;
    }

    addTodo(list, title, description, date, time, priority) {
        list.addTodo({
            title: title,
            description: description || null,
            date: date || null,
            time: time || null,
            priority: priority
        });
        // save to storage
        this.project.saveToStorage();
    }

    removeTodo(id) {
        const found = this.find(id);
        if (found) {
            found.list.removeTodo(id);
        }
        // save to storage
        this.project.saveToStorage();
    }

    createTodoElement(todo) {
        const container = document.createElement('div');
        container.classList.add('todo-item');
        container.dataset.id = todo.id;

        if (this.activeTodo && this.activeTodo.id === todo.id) {
            container.classList.add('active-todo');
        }

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = todo.completed;
        container.appendChild(check);

        const content = document.createElement('div');
        content.classList.add('todo-content');

        const title = document.createElement('h3');
        title.classList.add('todo-title');
        title.textContent = todo.title;

        const remove = document.createElement('button');
        remove.classList.add('remove');
        remove.textContent = 'x';

        const edit = document.createElement('button');
        edit.classList.add('edit');
        edit.textContent = 'edit';

        content.appendChild(title);

        if (todo.description) {
            const desc = document.createElement('h6');
            desc.classList.add('todo-description');
            desc.textContent = todo.description;
            if (!this.activeTodo || this.activeTodo.id !== todo.id) {
                desc.classList.add('hidden');
            }
            content.appendChild(desc);
        }

        if (todo.date) {
            const datetime = document.createElement('h5');
            datetime.classList.add('todo-datetime');
            datetime.textContent = todo.date;
            if (todo.time && (this.activeTodo && this.activeTodo.id === todo.id)) {
                const parsed = this.parse(todo.date, todo.time);
                const formatted = format(parsed, 'hh:mmaaa');
                datetime.textContent += `, ${formatted}`;
            }
            content.appendChild(datetime);
        }

        container.appendChild(content)

        if (todo.priority !== 'none') {
            const priority = document.createElement('h3');
            priority.classList.add('todo-priority');
            switch (todo.priority) {
                case 'low': priority.textContent = '!'; break;
                case 'medium': priority.textContent = '!!'; break;
                case 'high': priority.textContent = '!!!'; break;
            }
            container.appendChild(priority);
        }

        container.append(content, edit, remove);

        return container;
    }

    renderTodos(list) {
        this.changeView(list.name);
        this.clear(this.todoContainer);

        list.todos.forEach(todo => {
            this.todoContainer.appendChild(this.createTodoElement(todo));
        });
    }

    changeCompletion(id, completion) {
        const found = this.find(id);
        if (found) {
            found.todo.completed = completion;
        }
        // save to storage
        this.project.saveToStorage();
    }

    expandTodo(id) {
        // if no active or other todo is active
        if (!this.activeTodo || this.activeTodo.id !== id) {
            this.setActiveTodo(id);
        } else if (this.activeTodo.id === id) {
            this.activeTodo = null;
        }
    }

    editTodo(id, title, description, date, time, priority) {
        const list = this.find(id).list;
        list.editTodo(id, {
            title: title,
            description: description || null,
            date: date || null,
            time: time || null,
            priority: priority 
        });
        // save to storage
        this.project.saveToStorage();
    }

    // event listeners
    eventListeners() {
        // add list
        this.addListBtn.addEventListener('click', () => {
            this.listDialog.showModal();
        });

        // add list: check for input
        this.listInputName.addEventListener('input', () => {
            if (this.listInputName.value.trim() !== '') {
                const names = this.project.lists.map(list => list.name);
                
                if (!names.includes(this.listInputName.value.trim())) {
                    this.listSubmit.disabled = false;
                } else {
                    this.listSubmit.disabled = true;
                }
            } else {
                this.listSubmit.disabled = true;
            }
        });

        // add list: submit
        this.listSubmit.addEventListener('click', () => {
            // if not editing add list
            if (!this.editListId) {
                this.setActiveList(this.project.addList(this.listInputName.value.trim()));
            } else if (this.editListId) {
                this.editList(this.editListId, this.listInputName.value);
                this.setActiveList(this.editListId);
            } 
            // enable add todo button
            this.addTodoBtn.disabled = false;
            // switch to list
            this.renderTodos(this.activeList)
            // render lists
            this.renderLists();
        });

        // add list: close reset input
        this.listDialog.addEventListener('close', () => {
            this.editListId = null;
            this.resetDialog(this.listDialog);
        });

        // lists on click
        this.listContainer.addEventListener('click', (e) => {
            // handle remove
            const remove = e.target.closest('.remove');
            if (remove) {
                e.stopPropagation();
                const id = remove.parentElement.dataset.id;
                if (confirm('Delete list?')) {
                    this.removeList(id);
                    this.renderLists();
                }
                return;
            }

            // handle edit
            const edit = e.target.closest('.edit');
            if (edit) {
                e.stopPropagation();
                const id = edit.parentElement.dataset.id;
                this.editListId = id;
                this.showDialog(this.listDialog);
                return;
            }

            // handle list click
            const listItem = e.target.closest('.list-item-container');
            if (listItem) {
                this.activeTodo = null;
                const id = listItem.dataset.id;
                this.setActiveList(id);
                this.addTodoBtn.disabled = false;
                this.renderTodos(this.activeList);
                this.renderLists();
            }
        });
        
        // add todo
        this.addTodoBtn.addEventListener('click', () => {
            this.showDialog(this.todoDialog);
        });

        // add todo: check for title
        this.todoInputTitle.addEventListener('input', () => {
            if (this.todoInputTitle.value.trim() !== '') {
                this.todoSubmit.disabled = false;
            } else {
                this.todoSubmit.disabled = true;
            }
        });

        // todo: submit
        this.todoSubmit.addEventListener('click', () => {
            const title = this.todoInputTitle.value;
            const desc = this.todoInputDesc.value;
            const date = this.todoInputDate.value;
            const time = this.todoInputTime.value;
            const pri = this.todoInputPri.value;
            // check if editing todo or adding
            if (!this.editTodoId) {
                this.addTodo(this.activeList, title, desc, date, time, pri);
            } else if (this.editTodoId) {
                this.editTodo(this.editTodoId, title, desc, date, time, pri);
            }
            this.refreshView();
        });

        // add todo: close dialog reset
        this.todoDialog.addEventListener('close', () => {
            this.editTodoId = null;
            this.resetDialog(this.todoDialog);
        });

        // todo on click
        this.todoContainer.addEventListener('click', (e) => {
            // handle remove
            const remove = e.target.closest('.remove');
            if (remove) {
                e.stopPropagation();
                const id = remove.parentElement.dataset.id;
                if (confirm('Remove to-do item?')) {
                    this.removeTodo(id);
                    this.refreshView();
                }
                return;
            }

            // handle edit
            const edit = e.target.closest('.edit');
            if (edit) {
                e.stopPropagation();
                this.editTodoId = edit.parentElement.dataset.id;
                this.showDialog(this.todoDialog);
                return;
            }

            //handle checkbox
            const checkbox = e.target.closest('input');
            if (checkbox) {
                e.stopPropagation();
                const id = checkbox.parentElement.dataset.id;
                if (checkbox.checked) {
                    this.changeCompletion(id, true);
                } else {
                    this.changeCompletion(id, false);
                }
                return;
            }

            // handle details
            const todo = e.target.closest('.todo-item');
            if (todo) {
                const id = todo.dataset.id;
                this.expandTodo(id, todo);
                this.refreshView();
            } else {
                this.activeTodo = null;
                this.refreshView();
            }
        });

        // views
        this.viewBtns.forEach(button => {
            button.addEventListener('click', () => {
                this.activeTodo = null;
                const view = button.dataset.view;
                this.activeList = null;
                this.addTodoBtn.disabled = true;

                switch(view) {
                    case 'all': this.renderAll(); break;
                    case 'today': this.renderToday(); break;
                    case 'past': this.renderPast(); break;
                    case 'completed': this.renderCompleted(); break;
                }
                this.renderLists();
            });
        });
    }
}