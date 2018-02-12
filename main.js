
const input = document.getElementById('input');
const addButton = document.getElementById('add-Button');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');
const form = document.getElementById('form');
const template = document.getElementById('list-item-template');
const templateDone = document.getElementById('done-list-item-template');
const deleteButton = document.getElementById('delete-button');
const todoEl = '';
const doneEl = '';

const addTodo = () => {
    const todoEl = template.cloneNode(true);
    todoEl.id = '';

    const todoItem = todoEl.querySelector('.todo-title');
    const deleteButton = todoEl.querySelector('.delete-button');
    const checkButton = todoEl.querySelector('.check-button');
    const uncheckButton = todoEl.querySelector('.uncheck-button');

    todoItem.innerText = input.value;

    deleteButton.addEventListener('click', () => deleteTodo(todoEl));
    checkButton.addEventListener('click', () => checkOff(todoEl));
    uncheckButton.addEventListener('click', () => unCheck(todoEl));

    todoList.appendChild(todoEl);
};

const unCheck = (todoEl) => {
    const todoItem = todoEl.querySelector('.todo-title');
    todoList.appendChild(todoEl);
    todoItem.classList.remove('line-through');
}

const checkOff = (todoEl) => {
    const todoItem = todoEl.querySelector('.todo-title');
    completedList.appendChild(todoEl);
    todoItem.classList.add('line-through');
}

const deleteTodo = (todoEl) => {
    todoEl.remove();
};

form.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
});

const deleteAll = (list) => {
    const listItems = list.querySelectorAll('.todo-item');

    for (const listItem of listItems) {
        listItem.remove();
    }
}

const deleteAllTodosButton = document.getElementById('delete-all-todos');
const deleteAllCompletedButton = document.getElementById('delete-all-completed');

deleteAllTodosButton.addEventListener('click', () => deleteAll(todoList));
deleteAllCompletedButton.addEventListener('click', () => deleteAll(completedList));

