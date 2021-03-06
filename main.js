const form = document.getElementById('form');
const input = document.getElementById('input');
const unfinishedList = document.getElementById('unfinished-list');
const finishedList = document.getElementById('finished-list');
const todoItemTemplate = document.getElementById('template');
const clearAllUnfinishedButton = document.getElementById('clear-all-unfinished');
const clearAllFinishedButton = document.getElementById('clear-all-finished');
const deleteAllButton = document.getElementById('delete-all-button');
let todos = loadTodosFromLocalStorage();

// validates user input and prevents duplicate todos
const isValidInput = (todoTitle) => {

    for (todo of todos) {
        if (todo.title === todoTitle) {
            return false;
        }
    }

    return true;
}

// validates user input and prevents user to add empty todos
const isTodoTitleEmpty = (todoTitle) => {

    if (todoTitle.trim() === '') {

        return true;
    }

    return false;
}

// gives user feedback if user fills in the input wrong
const showAlert = (error) => {

    if (error === 'invalid') {
        const duplicationAlert = document.getElementById('alert-duplicate');
        duplicationAlert.classList.remove('hidden');
    } else {
        const emptyAlert = document.getElementById('alert-empty');
        emptyAlert.classList.remove('hidden');
    }

}

// hides the alert again if the user fills in the input successfully
const hideAlerts = () => {
    const duplicationAlert = document.getElementById('alert-duplicate');
    duplicationAlert.classList.add('hidden');

    const emptyAlert = document.getElementById('alert-empty');
    emptyAlert.classList.add('hidden');
}

const addTodo = (todoTitle, validate, animate) => {

    // if add button is clicked when input field is empty dont' add todo
    if (validate && isTodoTitleEmpty(todoTitle)) {
        showAlert('empty');
        return;
    }

    // if todo already exist, leave the function and don't add todo
    if (validate && !isValidInput(todoTitle)) {
        showAlert('invalid');
        return;
    }

    // instead of using innerHTML each todo-item is cloned to prevent mixing html and JS
    const todoElement = todoItemTemplate.cloneNode(true);
    // id is used to hide template in css but new items should be shown
    todoElement.id = '';

    // sets the todoTitle to the inserted todos title
    const todoItem = todoElement.querySelector('.todo-title');
    todoItem.innerText = todoTitle;

    const deleteButton = todoElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => deleteTodo(todoElement));

    const checkButton = todoElement.querySelector('.check-button');
    checkButton.addEventListener('click', () => checkOffTodo(todoElement, true));

    const undoButton = todoElement.querySelector('.undo-button');
    undoButton.addEventListener('click', () => undoTodo(todoElement));

    /* the animation shouldn't be triggered when site is refreshed,
    so animate is only true when called inside the add function,
    not when the todos are rendered from storage */    
    if (animate) {
        todoElement.classList.add('fadeIn');
    } else {
        todoElement.classList.remove('opacity-0');
    }

    // append the new item to unfinishedList
    unfinishedList.appendChild(todoElement);

    hideAlerts();

    // to save new todo localstorage must be updated
    updateTodos();
    return todoElement;
};

/* updates the localstorage */
const updateTodos = () => {

    // get all todo-items in the unfinishedList except the template
    const todoItems = unfinishedList.querySelectorAll('.todo-item:not([id="template"]) .todo-title');
    todos = [];

    // push in each the the unfinished todos
    for (const todo of todoItems) {
        todos.push({ title: todo.innerText, completed: false });
    }

    // gets all todo-items in finishedList
    const completedItems = finishedList.querySelectorAll('.todo-item .todo-title');

    // push in each the the finished todos
    for (const todo of completedItems) {
        todos.push({ title: todo.innerText, completed: true });
    }

    // converts array to JSON string for readability and saves in localstorage
    window.localStorage.todoData = JSON.stringify(todos);
}

const undoTodo = (todoElement) => {
    const todoTitle = todoElement.querySelector('.todo-title');
    todoTitle.classList.remove('line-through');

    unfinishedList.appendChild(todoElement);
    updateTodos();
}

const checkOffTodo = (todoElement, animate) => {
    const todoTitle = todoElement.querySelector('.todo-title');
    todoTitle.classList.add('line-through');

    /* the animation shouldn't be triggered when site is refreshed,
    so animate is only true when called inside the checkoff function,
    not when the todos are rendered from storage */
    if (animate) {
        todoTitle.classList.add('fadeOut');

        /* the item should fade out in the unfinished list before it fades in into the
        finished div, to make sure this happens a setTimeout is used */
        setTimeout(() => {
            finishedList.appendChild(todoElement);
            todoTitle.classList.remove('fadeOut');
            todoTitle.classList.add('fadeIn');
            updateTodos();
        }, 400);

    } else {
        todoTitle.classList.remove('opacity-0');
        finishedList.appendChild(todoElement);
        updateTodos();
        return;
    }

}

const deleteTodo = (todoElement) => {

    todoElement.classList.add('fadeOut');

    // to make sure that item animates before its deleted
    setTimeout(() => {
        todoElement.remove();
        updateTodos();
    }, 400);

};

const deleteAllTodos = () => {

    clearListOfTodos(unfinishedList);
    clearListOfTodos(finishedList);

}

const clearListOfTodos = (list) => {
    const listItems = list.querySelectorAll('.todo-item');

    for (const listItem of listItems) {
        if (listItem.id !== 'template') {
            listItem.classList.add('fadeOut');

            // to make sure that item animates before its deleted
            setTimeout(() => {
                listItem.remove();
                updateTodos();
            }, 400);

        }
    }
}

const createTodoItemsFromTodoList = (todoList) => {

    for (const todo of todoList) {
        const todoElement = addTodo(todo.title, false, false);

        if (todo.completed) {
            checkOffTodo(todoElement, false);
        }
    }

}

function loadTodosFromLocalStorage() {

    let todos = [];

    if (window.localStorage.todoData) {
        // converts todo from JSON string back to an array
        todos = JSON.parse(window.localStorage.todoData);
    } else {
        // if localstorage is empty ie for first time usage we add to example todos for demo
        todos = [
            { title: 'This is a finished task', completed: true },
            { title: 'This is an unfinished task', completed: false }
        ];
    }

    return todos;
}

clearAllUnfinishedButton.addEventListener('click', () => clearListOfTodos(unfinishedList));
clearAllFinishedButton.addEventListener('click', () => clearListOfTodos(finishedList));
deleteAllButton.addEventListener('click', deleteAllTodos);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo(input.value, true, true);
    input.value = '';
    input.focus();
});

createTodoItemsFromTodoList(todos);