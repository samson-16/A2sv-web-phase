// 1. Define the interface
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

// 2. Todo list array
let todos: TodoItem[] = [];

// 3. Add a new task
function addTodo(title: string): void {
  const newTodo: TodoItem = {
    id: Date.now(),
    title,
    completed: false
  };
  todos.push(newTodo);
  console.log(`✅ Added: ${title}`);
}

// 4. Remove a task by ID
function removeTodo(id: number): void {
  todos = todos.filter(todo => todo.id !== id);
  console.log(`🗑️ Removed task with ID: ${id}`);
}

// 5. Show all tasks
function listTodos(): void {
  console.log("📋 Todo List:");
  if (todos.length === 0) {
    console.log("No tasks yet.");
  } else {
    todos.forEach(todo => {
      const status = todo.completed ? "✅" : "⬜";
      console.log(`${status} [${todo.id}] ${todo.title}`);
    });
  }
}

// 6. Mark a task as completed
function completeTodo(id: number): void {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = true;
    console.log(`✔️ Marked as completed: ${todo.title}`);
  } else {
    console.log("❌ Task not found.");
  }
}


export { addTodo, listTodos, removeTodo, completeTodo };
