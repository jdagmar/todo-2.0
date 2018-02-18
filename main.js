const form = document.getElementById('form');
const input = document.getElementById('input');
const unfinishedList = document.getElementById('unfinished-list');
const finishedList = document.getElementById('finished-list');
const todoItemTemplate = document.getElementById('template');
const clearAllUnfinishedButton = document.getElementById('clear-all-unfinished');
const clearAllFinishedButton = document.getElementById('clear-all-finished');
const deleteAllButton = document.getElementById('delete-all-button');

let todos = loadTodosFromLocalStorage();

/* validates user input and prevents duplicate todos */
const isValidInput = (todoTitle) => {

    for (todo of todos) {
        if (todo.title === todoTitle) {
            return false;
        }
    }

    return true;
}

const showAlert = () => {
    const alert = document.getElementById('alert');
    alert.classList.remove('hidden');
}

const addTodo = (todoTitle, validate, animate) => {

    //if todo already exist leave the function and don't add todo
    if (validate && !isValidInput(todoTitle)) {
        showAlert();
        return;
    }

    //instead of using innerHTML each todo-item is cloned
    const todoElement = todoItemTemplate.cloneNode(true);
    //id is used to hide template in css but new items should be shown
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

    //We dont want any animation when user refresh the page so we control this here
    if (animate) {
        todoElement.classList.add('fadeIn');
    } else {
        todoElement.classList.remove('opacity-0');
    }

    // append the new item to unfinishedList
    unfinishedList.appendChild(todoElement);

    // to save new todo localstorage must be updated
    updateTodos();
    return todoElement;
};

/* updates the localstorage */
const updateTodos = () => {

    //get all todo-items in the unfinishedList except the template
    const todoItems = unfinishedList.querySelectorAll('.todo-item:not([id="template"]) .todo-title');
    todos = [];

    //push in each the the unfinished todos
    for (const todo of todoItems) {
        todos.push({ title: todo.innerText, completed: false });
    }

    //gets all todo-items in finishedList
    const completedItems = finishedList.querySelectorAll('.todo-item .todo-title');

    //push in each the the finished todos
    for (const todo of completedItems) {
        todos.push({ title: todo.innerText, completed: true });
    }

    //converts array to JSON string for readability and saves in localstorage
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

    /* to make sure the animations is not triggered when user refresh the page the function
    we check if animate is true or false when the function is called */
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
        //if localstorage is empty ie for first time usage we add to example todos for demo
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