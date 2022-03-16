const StateKey = 'data_todo-app-pure-javascript';
let todoList = [];
let doneList = [];
let inputItem = document.querySelector('.inputItem');
let addButton = document.querySelector('.addButton');
let todo = document.querySelector('.todo');
let todoDone = document.querySelector('.todoDone')
let removeList = [];
let displayTitleDoneList = document.querySelector('.displayTitleDoneList')
loadState();

todo.addEventListener('click', handleClick);
todoDone.addEventListener('click', handleClick);

addButton.addEventListener('click', function () {
    if (inputItem.value === '') {
        return;
    } else {
        let newTodo = {
            todo: inputItem.value,
        };

        todoList.push(newTodo);
        inputItem.value = '';
        render();
        saveState();
    };
});

// выводим список значений элементов в массиве todoList
function render() {
    todo.innerHTML = renderList(todoList, 'list');
    todoDone.innerHTML = renderList(doneList, 'done');

    displayTitleDoneLists();
};

function renderList(list, type) {
    let msg = '';
    let liClasses = type === 'done' ? 'list-group-item-info' : '';
    let inputChecked = type === 'done' ? 'checked' : '';

    list.forEach(function (it, ix) {
        let itemNumber = type === 'done' ? '' : `${ix + 1}. `; 
        msg += `
            <li class='list-group-item ${liClasses}' data-ix='${ix}' data-type='${type}'>
                <input type='checkbox' ${inputChecked} class='js-checkbox' />
                <label for='item_${ix}'>${itemNumber}${it.todo}</label>
                <button class='js-remove button btn-close' aria-label='Close'></button>
            </li>
        `;
    });

    return msg;
};

function handleClick(event) {
    if (event.target.className.includes('js-remove')) {
        onRemoveClick(event);
    };
    if (event.target.className.includes('js-checkbox')) {
        onCheckboxClick(event);
    };
};

function onRemoveClick(event) {
    let button = event.target;
    let li = button.closest('li');
    let ix = +li.getAttribute('data-ix');
    let type = li.getAttribute('data-type');

    if (type === 'done') {
        doneList.splice(ix, 1);
    } else {
        todoList.splice(ix, 1);
    }

    saveState();
    render();
};

function onCheckboxClick(event) {
    let checkbox = event.target;
    let li = checkbox.closest('li');
    let ix = +li.getAttribute('data-ix');
    let type = li.getAttribute('data-type');

    if (type === 'done') {
        let deletedItem = doneList.splice(ix, 1);
        deletedItem = deletedItem[0];
        todoList.push(deletedItem);
    } else {
        let deletedItem = todoList.splice(ix, 1);
        deletedItem = deletedItem[0];
        doneList.push(deletedItem);
    };

    saveState();
    render();
};

// появляем, или исчезаем заголовок - DoneList
function displayTitleDoneLists() {
    if (doneList.length > 0) {
        displayTitleDoneList.style.display = "block";
    } else {
        displayTitleDoneList.style.display = "none";
    };

    saveState();
};

// сохраняем данные в localStorage
function saveState() {
    localStorage.setItem(StateKey, JSON.stringify({ todoList: todoList, doneList: doneList }));
};
function loadState() {
    let data = localStorage.getItem(StateKey);
    if (data) {
        data = JSON.parse(data);
        todoList = data.todoList;
        doneList = data.doneList;

        render();
    };

};

