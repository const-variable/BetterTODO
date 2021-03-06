// let lists = {
//         list1: [
//             {id: 1, text: 'Drink some water', completed: true},
//             {id: 2, text: 'Go read javascript', completed: false},
//             {id: 3, text: 'Complete ToDo app', completed: false},
//         ],
//         list2: [
//             {id: 1, text: 'Eat 2 bananas today', completed:false },
//             {id: 2, text: 'Plan this weekend', completed: false}
//         ]
// }


// *** constants ****

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-todo-container]');
const listTitleElement = document.querySelector('[data-todo-list-title]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');

let lists = [
    // { id: 1, name: 'Home', tasks: [{ id: 1, name: 'task1', complete: false },{ id: 2, name: 'task2', complete: false }] },
    // { id: 2, name: 'Office', tasks: [{ id: 1, name: 'Complete todo', complete: true }] },
    // { id: 3, name: 'Personal', tasks:[] },
];

let selectedListID = null;
let updatedContent = '';

//  ***** eventListeners ****

newListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const listName = newListInput.value;
    if (!listName) {
        return
    }
    const newList = createList(listName);
    newListInput.value = '';
    lists.push(newList);
    render();

})

newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (!taskName) {
        return
    }
    const newTask = createTask(taskName);
    newTaskInput.value = '';
    const selectedList = lists.find(item => item.id == selectedListID);

    selectedList.tasks.push(newTask);
    render();

})

tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() == 'input') {
        const selectedList = lists.find(list => list.id == selectedListID)
        const selectedTask = selectedList.tasks.find(task => task.id == e.target.id);
        selectedTask.complete = e.target.checked;
        render();
    }

    if (e.target.className == 'delete') {
        const selectedList = lists.find(list => list.id == selectedListID)
        selectedList.tasks = selectedList.tasks.filter(list => list.id != e.target.parentElement.id)
        console.log(e.target.parentElement.id)
        render();
    }

})

// tasksContainer.addEventListener('input', (e) => {
//     if (e.target.tagName.toLowerCase() == 'label') {
//         console.log("content", e.target.textContent);
//     }
// })

tasksContainer.addEventListener('focusout', e => {
    if (e.target.tagName.toLowerCase() == 'label') {
        console.log("tasks is focused out", e.target.textContent);
        const selectedList = lists.find(list => list.id == selectedListID)
        const selectedTask = selectedList.tasks.find(list => list.id == e.target.htmlFor)
        console.log(selectedTask);
        selectedTask.name = e.target.textContent;
        render();
    }
})

listsContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() == 'li') {
        selectedListID = e.target.dataset.listId;
    }
    render();
});

// listsContainer.addEventListener('dblclick', e =>{
//     console.log('checl',e)
//     alert('Wew, I said double click on a task, not list.');
//     // console.log(e.target);
//     // if(e.target.tagName.toLowerCase()=='li'){
//     //     console.log("-_-, I said double click on a task, this is list.")
//     // }
// });

deleteListButton.addEventListener('click', () => {
    lists = lists.filter(list => list.id !== selectedListID)
    selectedListID = null;
    render();
})




// ***** Functions *****

function createList(listName) {
    let id = Date.now().toString();
    selectedListID = id;
    return { id: id, name: listName, tasks: [] }
}

function createTask(taskName) {
    let id = Date.now().toString();
    return { id: id, name: taskName, complete: false }
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(element => element.id == selectedListID)

    if (selectedListID == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.textContent = selectedList.name;

        clearElement(tasksContainer);
        renderTasks(selectedList);

    }
}


function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        
        const checkBox = taskElement.querySelector('input');
        checkBox.id = task.id;
        checkBox.checked = task.complete;

        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        
        if(task.complete){
            const strike = document.createElement('s');
            strike.textContent = task.name; 
            label.append(strike);
        } else {
            label.contentEditable = true;
            label.append(task.name);
        }

        const parentDivElement = taskElement.querySelector('div');
        parentDivElement.id = task.id;
        tasksContainer.appendChild(taskElement);
    })
}

function renderLists() {
    lists.forEach(element => {
        const createdElement = document.createElement('li');
        createdElement.classList = 'list-name';
        createdElement.dataset.listId = element.id;
        createdElement.textContent = element.name;


        //adding a active class to selected list
        if (element.id == selectedListID) {
            createdElement.classList.add('active-list');
        }

        listsContainer.appendChild(createdElement)
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();
alert('Double click on a task to edit it');