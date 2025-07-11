const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');

let editingTaskElement = null;

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    taskInput.value = '';
  }
});

function addTask(text) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = text;

  span.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  const controls = document.createElement('div');
  controls.className = 'task-controls';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => openModal(li, span);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => li.remove();

  controls.appendChild(editBtn);
  controls.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(controls);

  taskList.appendChild(li);
}

function openModal(taskElement, spanElement) {
  editingTaskElement = spanElement;
  editTaskInput.value = spanElement.textContent;
  editModal.style.display = 'flex';
  editTaskInput.focus();
}

function closeModal() {
  editModal.style.display = 'none';
  editingTaskElement = null;
}

saveEditBtn.addEventListener('click', () => {
  if (editingTaskElement && editTaskInput.value.trim()) {
    editingTaskElement.textContent = editTaskInput.value.trim();
    closeModal();
  }
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTaskBtn.click();
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeModal();
  }
});
