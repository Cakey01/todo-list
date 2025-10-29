import { Projects } from './projects.js'
import { Display } from './display.js';

import '../styles/styles.css'

// create projects to group all lists
const project = new Projects();
const display = new Display(project);

display.eventListeners();


