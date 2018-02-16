
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

let todos = [
    { title: 'This is a finished task', completed: true },
    { title: 'This is an unfinished task', completed: false }
];

const isValidInput = (todoTitle) => {
    const alert = document.getElementById('alert');

    for (todo of todos) {
        if (todo.title === todoTitle) {
            alert.classList.remove('hidden');
            return false;
        }
    }

    return true;

}

const addTodo = (todoTitle, validate) => {

    if (validate && !isValidInput(todoTitle)){
       return;
    }

    const todoEl = template.cloneNode(true);
    todoEl.id = '';

    const todoItem = todoEl.querySelector('.todo-title');
    const deleteButton = todoEl.querySelector('.delete-button');
    const checkButton = todoEl.querySelector('.check-button');
    const uncheckButton = todoEl.querySelector('.uncheck-button');

    todoItem.innerText = todoTitle;

    deleteButton.addEventListener('click', () => deleteTodo(todoEl));
    checkButton.addEventListener('click', () => checkOff(todoEl));
    uncheckButton.addEventListener('click', () => unCheck(todoEl));

    todoList.appendChild(todoEl);

    saveTodo();
    return todoEl;
};

const saveTodo = () => {
    const todoItems = todoList.querySelectorAll('.todo-item:not([id="list-item-template"]) .todo-title');
    todos = [];

    for (const todo of todoItems) {
        todos.push({ title: todo.innerText, completed: false });
    }

    const completedItems = completedList.querySelectorAll('.todo-item:not([id="done-list-item-template"]) .todo-title');

    for (const todo of completedItems) {
        todos.push({ title: todo.innerText, completed: true });
    }

    window.localStorage.todoData = JSON.stringify(todos);
}

const unCheck = (todoEl) => {
    const todoItem = todoEl.querySelector('.todo-title');
    todoList.appendChild(todoEl);
    todoItem.classList.remove('line-through');
    saveTodo();
}

const checkOff = (todoEl) => {
    const todoItem = todoEl.querySelector('.todo-title');
    completedList.appendChild(todoEl);
    todoItem.classList.add('line-through');
    saveTodo();
}

const deleteTodo = (todoEl) => {
    todoEl.remove();
    saveTodo();
};

const deleteAllButton = document.getElementById('delete-all');

const clearAll = () => {
    const listItems = document.querySelectorAll('.todo-item');

    for (const listItem of listItems) {
        listItem.remove();
    }

    saveTodo();
}

deleteAllButton.addEventListener('click', clearAll);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo(input.value, true);
    input.value = '';
    input.focus();
});

const deleteAll = (list) => {
    const listItems = list.querySelectorAll('.todo-item');

    for (const listItem of listItems) {
        listItem.remove();
    }

    saveTodo();
}

const deleteAllTodosButton = document.getElementById('delete-all-todos');
const deleteAllCompletedButton = document.getElementById('delete-all-completed');

deleteAllTodosButton.addEventListener('click', () => deleteAll(todoList));
deleteAllCompletedButton.addEventListener('click', () => deleteAll(completedList));

if (window.localStorage.todoData) {
    todos = JSON.parse(window.localStorage.todoData);
}

for (const todo of todos) {
    const todoEl = addTodo(todo.title, false);

    if (todo.completed) {
        checkOff(todoEl);
    }
}
