const form = document.getElementById('form');
const input = document.getElementById('input');

const unfinishedList = document.getElementById('unfinished-list');
const finishedList = document.getElementById('finished-list');

const unfinishedTemplate = document.getElementById('unfinished-template');
const finishedTemplate = document.getElementById('finished-template');

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

const addTodo = (todoTitle, validate, animate) => {

    if (validate && !isValidInput(todoTitle)){
       return;
    }

    const todoElement = unfinishedTemplate.cloneNode(true);
    todoElement.id = '';

    const todoItem = todoElement.querySelector('.todo-title');
    const deleteButton = todoElement.querySelector('.delete-button');
    const checkButton = todoElement.querySelector('.check-button');
    const undoButton = todoElement.querySelector('.undo-button');

    todoItem.innerText = todoTitle;

    deleteButton.addEventListener('click', () => deleteTodo(todoElement));
    checkButton.addEventListener('click', () => checkOffTodo(todoElement, true));
    undoButton.addEventListener('click', () => undoTodo(todoElement));

    if(animate){
        todoElement.classList.add('fadeIn');
    } else {
        todoElement.classList.remove('opacity-0');
    }

    unfinishedList.appendChild(todoElement);

    updateTodos();
    return todoElement;
};

const updateTodos = () => {

    const todoItems = unfinishedList.querySelectorAll('.todo-item:not([id="unfinished-template"]) .todo-title');
    todos = [];

    for (const todo of todoItems) {
        todos.push({ title: todo.innerText, completed: false });
    }

    const completedItems = finishedList.querySelectorAll('.todo-item:not([id="finished-template"]) .todo-title');

    for (const todo of completedItems) {
        todos.push({ title: todo.innerText, completed: true });
    }

    window.localStorage.todoData = JSON.stringify(todos);
}

const undoTodo = (todoElement) => {
    const todoItem = todoElement.querySelector('.todo-title');
    unfinishedList.appendChild(todoElement);
    todoItem.classList.remove('line-through');
    updateTodos();
}

const checkOffTodo = (todoElement, animate) => {
    const todoItem = todoElement.querySelector('.todo-title');
    todoItem.classList.add('line-through');

    if (animate){
        todoItem.classList.add('fadeOut');
        setTimeout(() => {
            finishedList.appendChild(todoElement);
            todoItem.classList.remove('fadeOut');
            todoItem.classList.add('fadeIn');
            updateTodos();
        }, 400);
        
    } else {
        todoItem.classList.remove('opacity-0');
        finishedList.appendChild(todoElement);
        updateTodos();
        return;
    }

}

const deleteTodo = (todoElement) => {

    todoElement.classList.add('fadeOut');

    setTimeout(() => {
      todoElement.remove();
      updateTodos();
    }, 400);
   
};

const deleteAllButton = document.getElementById('delete-all-button');

const deleteAllTodos = () => {
    const listItems = document.querySelectorAll('.todo-item');

    for (const listItem of listItems) {

        listItem.classList.add('fadeOut');

        setTimeout(() => {
            listItem.remove();
            updateTodos();
        }, 400);
       
    }
}

deleteAllButton.addEventListener('click', deleteAllTodos);

form.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo(input.value, true, true);
    input.value = '';
    input.focus();
});

const clearListOfTodos = (list) => {
    const listItems = list.querySelectorAll('.todo-item');

    for (const listItem of listItems) {

        listItem.classList.add('fadeOut');

        setTimeout(() => {
            listItem.remove();
            updateTodos();
        }, 400);
       
    }

}

const clearAllUnfinishedButton = document.getElementById('clear-all-unfinished');
const clearAllFinishedButton = document.getElementById('clear-all-finished');

clearAllUnfinishedButton.addEventListener('click', () => clearListOfTodos(unfinishedList));
clearAllFinishedButton.addEventListener('click', () => clearListOfTodos(finishedList));

if (window.localStorage.todoData) {
    todos = JSON.parse(window.localStorage.todoData);
}

for (const todo of todos) {
    const todoElement = addTodo(todo.title, false, false);

    if (todo.completed) {
        checkOffTodo(todoElement, false);
    }
}

