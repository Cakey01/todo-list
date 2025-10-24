import { Projects } from './projects.js'

// create projects to group all lists
const projects = new Projects();

// create default todo list
projects.addList('To-do');

projects.active.addTodo({ title: 'thing1', description: 'desc1', date: '2013-11-3'});
projects.active.addTodo({ title: 'thing2', time: '11:30'});
projects.active.addTodo({ title: 'title3', description: 'desc3', time: '11:30', priority: 'high'});
projects.active.addTodo({ title: 'title1', description: 'desc1', time: '11:30'});

// make another list
projects.addList('school');
projects.active.addTodo({ title: 'school1' });
projects.active.addTodo({ title: 'school2', priority: 'low'});
projects.active.addTodo({ title: 'school3', priority: 'medium'});
projects.active.addTodo({ title: 'school4', priority: 'high'});

projects.addList('other');

console.log(projects)
