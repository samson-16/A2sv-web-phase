// Define interface for a to-do item
interface TodoItem {
    id: number;
    task: string;
   
}


type TodoList = TodoItem[];


function createTodoList(): TodoList {
    return [];
}

function addTodo(todos: TodoList, task: string): TodoList {
    const newTodo: TodoItem = {
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        task,
       
    };
   
    return [...todos, newTodo];
}

// Remove a to-do item by ID
function removeTodo(todos: TodoList, id: number): TodoList {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        console.log(`Removed: "${todos[index].task}" (ID: ${id})`);
        return todos.filter(todo => todo.id !== id);
    }
    
    return todos;
}



// Display all to-do items
function displayTodos(todos: TodoList): void {
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

// Export all functions
export {
    createTodoList,
    addTodo,
    removeTodo,
   
    displayTodos
};
