#TypeScript To-Do List Application

A simple command-line to-do list manager built with TypeScript, featuring immutable operations and type safety.

## Features

✅ Add, remove, and display tasks


## Installation

1. Clone the repository:
```bash
git clone https://github.com/samson-16/A2sv-web-phase
cd TODOLIST-TS

#compile Typescript to javascript 
tsc

#Running the Application
node dist/todo.js


#Interactive Console Usage
##Start Node.js REPL:

node

#Sample code
const { createTodoList, addTodo, removeTodo, toggleTodoComplete, displayTodos } = require('./dist/todo.js');

// Create a new list
let list = createTodoList();

// Add tasks (ALWAYS assign back to list)
list = addTodo(list, "Learn typescript");
list = addTodo(list, "Do Task 2");

// Display tasks
displayTodos(list);

// Complete a task
list = toggleTodoComplete(list, 1);

// Remove a task
list = removeTodo(list, 2);

// Display updated list
displayTodos(list);
```

#Available functions:

createTodoList() - Creates new empty list

addTodo(list, task) - Adds new task

removeTodo(list, id) - Removes task by ID

displayTodos(list) - Shows current 


![App Screenshot](/src/screenshots/image.png)