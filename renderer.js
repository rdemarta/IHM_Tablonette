const { ipcRenderer } = require('electron');
const UUID = require('uuid-v4');
const mainBoard = document.getElementById('main-board');

// When we received some notes -> Create the notes and tasks DOM and display it
ipcRenderer.on('received-notes', (event, data) => { // IPC event listener
    // Display notes
    for (let note of data.notes) {
        addNoteToBoard(mainBoard, note);
    }

    // Display tasks
    for (let task of data.tasks) {
        addTaskToBoard(mainBoard, task);
    }

});

/**
 * Add a note object into a HTML board
 * @param board The HTML board element
 * @param note The note object
 */
function addNoteToBoard(board, note) {
    let noteElem = document.createElement("div");
    noteElem.className = "item item--note";

    let noteTitleElem = document.createElement("div");
    noteTitleElem.className = "item__title item--note__title";
    noteTitleElem.textContent = note.title;

    let noteContentElem = document.createElement("div");
    noteContentElem.className = "item__content item--note__content";
    noteContentElem.innerHTML = note.content; // innerHTML to interpret html tag as <br>

    noteElem.appendChild(noteTitleElem);
    noteElem.appendChild(noteContentElem);

    board.append(noteElem);
}

/**
 * Add a task object into a HTML board
 * @param board The HTML board element
 * @param task The task object
 */
function addTaskToBoard(board, task) {
    let taskElem = document.createElement("div");
    taskElem.className = "item item--task";

    let taskTitleElem = document.createElement("div");
    taskTitleElem.className = "item__title item--task__title";
    taskTitleElem.textContent = task.title;

    let taskSubtitleElem = document.createElement("div");
    taskSubtitleElem.className = "item__title item--task__subtitle";
    taskSubtitleElem.textContent = 'Pour le ' + task.dueDate;

    let taskContentElem = document.createElement("div");
    taskContentElem.className = "item__content item--task__content";
    taskContentElem.innerHTML = task.content; // innerHTML to interpret html tag as <br>

    let taskButton = document.createElement("div");
    taskButton.className = "btn btn--task btn--task-item";
    taskButton.innerHTML = 'Terminer';

    taskElem.appendChild(taskButton);
    taskElem.appendChild(taskTitleElem);
    taskElem.appendChild(taskSubtitleElem);
    taskElem.appendChild(taskContentElem);

    board.append(taskElem);
}

/**
 * Show a specific element
 * @param id
 * @param displayStyle
 */
function toggleById(id, displayStyle = 'block'){
    let element = document.getElementById(id);
    if(window.getComputedStyle(element).display === 'none') { // Show element
        element.style.display = displayStyle;
    } else { // Hide element
        element.style.display = 'none';
    }
}

/**
 * Loop through all form data, fetch them and create an object to return it
 * @param form The form element
 * @returns An object that contains all form data
 */
function fetchFormDataAsObject(form) {
    // Retrieve data from the form and populate the note object
    let obj = {};
    const formData = new FormData(form);
    for (let pair of formData.entries()) {
        obj[pair[0]] = pair[1];
    }

    return obj;
}

const formCreateNote = document.getElementById('formCreateNote');
formCreateNote.onsubmit = (event) => {
    event.preventDefault();

    // Generate new note
    let note = fetchFormDataAsObject(formCreateNote)
    note.uuid = UUID();

    // Add the note to the board
    addNoteToBoard(mainBoard, note);

    // Reset the form and close the modal
    formCreateNote.reset();
    toggleById('modal--newNote');

    // send note to main process to store it
    ipcRenderer.send("CH_NOTE", note);
}




