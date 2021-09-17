let allTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Хранятся таски
let valueInput = '';
let input = null;
const url = 'http://localhost:8000/'



window.onload = async function init() {
    input = document.getElementById('add-task');    // Ищем Input в документе, доступен всё время
    input.addEventListener('change', updateValue);  // Слушатель срабатывает при ИЗМЕНЕНИЯХ
    const resp = await fetch('http://localhost:8000/allTasks', {
        method: 'GET'
    });
    let result = await resp.json();
    allTasks = result.data;
    render();
}

const onClickButton = async() => {  // Нажимаем add  
    if (valueInput !== '') {
        allTasks.push({
            text: valueInput,
            isCheck: false,
        });
        const resp = await fetch('http://localhost:8000/createTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: valueInput,
                isCheck: false
            })
        });
        let result = await resp.json();
        allTasks = result.data; 
        localStorage.setItem('tasks', JSON.stringify(allTasks)); 
        valueInput = '';   // Обнуление
        input.value = '';   // Обнуление
        render();           // Добавляет таски на страницу
    }
}

const onClickRemove = async() => {
    const resp = await fetch(url + `deleteTasks`, {
        method: 'DELETE',
    });
    let result = await resp.json();
    allTasks = result.data;  
    localStorage.removeItem('tasks');
    render()
}

const updateValue = (e) => {
    valueInput = e.target.value; // Вносим в valueInput, значение input 
}

render = () => {    // Идёт по массиву, выводя все элементы
    const content = document.getElementById('content-page') // берём div для добавления в него чекбоксов
    while (content.firstChild) { // проверяем есть ли в div элементы
        content.removeChild(content.firstChild);  // Если true удаляем этот элемент
    }
    allTasks.map((item, index) => {
        const container = document.createElement('div'); // Здесь хранится таск
        // container.id = `task-${index}`; // добавляем контейнеру с чекбоксом уникальный ID 
        container.className = 'task-container'; // добавляем класс контейнеру с чекбоксом
        const checkbox = document.createElement('input'); // Чекбокс
        checkbox.type = 'checkbox'; // Чекбокс
        checkbox.checked = item.isCheck; // Проверяет true or false и ставит галочку
        checkbox.onchange = function () {  // Когда мы ставим галочку чекбоксу то...
            onChangeCheckbox(item) // Вызываем функцию для изменения чекбокса
        };
        container.appendChild(checkbox);    // добавляем Чекбокс в начало контейнера  
        const text = document.createElement('p');   // Создаём тег для хранения текста
        text.innerText = item.text; // Берём значение текста из allTasks и добавляем его в тег р
        text.className = item.isCheck ? 'done' : 'task';    // Добавляем стили
        container.appendChild(text);    // Добавляем тег р в наш контейнер чекбокса  

        const imageCheck = document.createElement('img');
        imageCheck.src = 'img/check.svg';

        const imageEdit = document.createElement('img');
        imageEdit.src = 'img/edit.svg';   // Изображение изменения
        container.appendChild(imageEdit);

        const entrance = document.createElement('input');
        imageEdit.onclick = () => {
            entrance.value = item.text;
            container.replaceChild(entrance, text);
            container.replaceChild(imageCheck, imageEdit)
            }
        
        imageCheck.onclick = () => onClickImageEdit(item, entrance.value);

        const imageDelete = document.createElement('img');
        imageDelete.src = 'img/delete.svg';    // Изображение удаления
        container.appendChild(imageDelete);
        imageDelete.onclick = () => onClickImageDelete(index);


        content.appendChild(container); // добавялем контейнер с чекбоксом в div
    });
}

const onChangeCheckbox = async(item) => {     // Передаём ID именно ЭТОГО чекбокса
    const resp = await fetch('http://localhost:8000/updateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            isCheck: !item.isCheck,
            id: item.id
        })
    });
    // allTasks[index].isCheck = !allTasks[index].isCheck;    // Элемент из массива allTasks под index изменяем на обратное значение
    let result = await resp.json();
    allTasks = result.data; 
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render()    
}

const onClickImageEdit = async(item, value) => {
    const resp = await fetch('http://localhost:8000/updateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            text: value,
            id: item.id
        })
    });
    let result = await resp.json();
    allTasks = result.data; 
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

const onClickImageDelete = async(index) => {
    // allTasks = allTasks.filter((itm, ind) => ind !== index);    // Фильтруем массив и удаляем искомый элемент
    const resp = await fetch(url + `deleteTask?id=${allTasks[index].id}`, {
        method: 'DELETE',
    });
    let result = await resp.json();
    allTasks = result.data; 
    localStorage.setItem('tasks', JSON.stringify(allTasks)); 
    render()
}


// let alueInput = '';

// window.onload = init = () => {
//     const input = document.getElementById('add-task');
//     input.addEventListener('keyup', updateValue)
// }

// onClickButton = () => {
//     // alert('click!');
// }

// updateValue = (event) => {
//     console.log('value', event.target.value);
//     valueInput = event.target.value
// }