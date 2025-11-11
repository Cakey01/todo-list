import { Projects } from './projects.js';
import { parse, isAfter, format } from 'date-fns';

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
        this.listCancel = listForm.querySelector('button[value="cancel"]')

        // todo dialog
        this.todoDialog = document.getElementById('todoDialog');
        this.addTodoBtn = document.getElementById('addTodo');
        this.todoSubmit = document.getElementById('todoSubmit');
        this.todoInputTitle = document.getElementById('todoInputTitle');
        this.todoInputDesc = document.getElementById('todoInputDesc');
        this.todoInputDate = document.getElementById('todoInputDate');
        this.todoInputTime = document.getElementById('todoInputTime');
        this.todoInputPri = document.getElementById('todoInputPri');

        // lists
        this.listContainer = document.getElementById('listContainer');
        this.activeList = null;

        // todos
        this.todoContainer = document.getElementById('todoContainer');
        this.todoItem = document.querySelectorAll('.todo-item');

        // header
        this.header = document.getElementById('currentView')

        // views
        this.views = document.getElementById('views');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.currentView = 'All';
    }

    // helpers
    clear(section) {
        section.innerHTML = '';
    }

    resetDialog(dialog) {
        const inputs = dialog.querySelectorAll('input');
        const submit = dialog.querySelector('button[value="default"]');

        inputs.forEach(input => {
            input.value = '';
        });
        submit.disabled = true;
        dialog.close();
    }

    parse(date, time) {
        if(date && !time) {
            return parse(date, 'MM-dd-yyyy', new Date());
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
        const date = new Date();
        
        // find lists with todos past due
        const lists = this.project.lists.filter(list =>
            list.todos.some(todo => isAfter(date, this.parse(todo.date, todo.time)))
        )

        if (lists.length !== 0) {
            lists.forEach(list => {
                const container = document.createElement('div');
                container.classList.add('item-container');

                const name = document.createElement('h2');
                name.textContent = list.name;
                container.appendChild(name);

                const todos = list.todos.filter(todo => isAfter(date, this.parse(todo.date, todo.time)));

                todos.forEach(todo => container.appendChild(this.createTodoElement(todo)));

                this.todoContainer.appendChild(container);
            })
        }
        console.log(lists)
        console.log(this.parse('11-24-2001'))
        


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

    // find list and todo by todo id
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
        if (this.activeList.id === container.dataset.id) {
            container.style.backgroundColor = 'aliceblue';
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

    // todos
    addTodo(list, title, description, date, time, priority) {
        list.addTodo({
            title: title,
            description: description || null,
            date: date || null,
            time: time || null,
            priority: priority
        });
    }

    removeTodo(id) {
        const found = this.find(id);
        if (found) {
            found.list.removeTodo(id);
        }
    }

    createTodoElement(todo) {
        const container = document.createElement('div');
        container.classList.add('todo-item');
        container.dataset.id = todo.id;

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = todo.completed;

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

        if (todo.date) {
            const date = document.createElement('h6');
            date.textContent = todo.date;
            content.appendChild(date);
        }

        container.append(check, content, edit, remove);

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
    }

    expandTodo(id) {
        // ...
    }

    editTodo(id) {
        // ...
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
                console.log(names)
                console.log(this.listInputName.value.trim());
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
            // add list and set as active
            this.setActiveList(this.project.addList(this.listInputName.value.trim()));
            // enable add todo button
            this.addTodoBtn.disabled = false;
            // switch to list
            this.renderTodos(this.activeList)
            // render lists
            this.renderLists();
        });

        // add list: close reset input
        this.listDialog.addEventListener('close', () => {
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

            // handle edit *** FINISH
            const edit = e.target.closest('.edit');
            if (edit) {
                e.stopPropagation();
                const id = edit.parentElement.dataset.id;
                return;
            }

            // handle list click
            const listItem = e.target.closest('.list-item-container');
            if (listItem) {
                const id = listItem.dataset.id;
                this.setActiveList(id);
                this.addTodoBtn.disabled = false;
                this.renderTodos(this.activeList);
                this.renderLists();
            }
        });
        
        // add todo
        this.addTodoBtn.addEventListener('click', () => {
            this.todoDialog.showModal();
        });

        // add todo: check for title
        this.todoInputTitle.addEventListener('input', () => {
            if (this.todoInputTitle.value.trim() !== '') {
                this.todoSubmit.disabled = false;
            } else {
                this.todoSubmit.disabled = true;
            }
        });

        // add todo: submit
        this.todoSubmit.addEventListener('click', () => {
            const title = this.todoInputTitle.value;
            const desc = this.todoInputDesc.value;
            const date = this.todoInputDate.value;
            const time = this.todoInputTime.value;
            const pri = this.todoInputPri.value;
            this.addTodo(this.activeList, title, desc, date, time, pri);
            this.renderTodos(this.activeList);
        })

        // add todo: close dialog reset
        this.todoDialog.addEventListener('close', () => {
            this.resetDialog(this.todoDialog);
        })

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

            // handle edit *** FINISH
            const edit = e.target.closest('.edit');
            if (edit) {
                e.stopPropagation();
                console.log('edit');
                return;
            }

            //handle checkbox *** FINISH
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

            // handle details *** FINISH
            const todo = e.target.closest('.todo-item');
            if (todo) {
                const id = todo.dataset.id;
                console.log('expand');
            }
        })

        // views
        this.viewBtns.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                this.addTodoBtn.disabled = true;

                switch(view) {
                    case 'all': this.renderAll(); break;
                    case 'today': this.renderToday(); break;
                    case 'past': this.renderPast(); break;
                    case 'completed': this.renderCompleted(); break;
                }
            });
        });
    }
}