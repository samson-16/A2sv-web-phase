"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodoList = createTodoList;
exports.addTodo = addTodo;
exports.removeTodo = removeTodo;
exports.displayTodos = displayTodos;
function createTodoList() {
    return [];
}
function addTodo(todos, task) {
    const newTodo = {
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        task,
    };
    return [...todos, newTodo];
}
function removeTodo(todos, id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        console.log(`Removed: "${todos[index].task}" (ID: ${id})`);
        return todos.filter(todo => todo.id !== id);
    }
    return todos;
}
function displayTodos(todos) {
    if (todos.length === 0) {
        console.log("No todos in the list.");
        return;
    }
    console.log("\nTo-Do List:");
    console.log("-----------");
    todos.forEach(todo => {
        console.log(` ${todo.id}. ${todo.task}`);
    });
    console.log("-----------\n");
}
