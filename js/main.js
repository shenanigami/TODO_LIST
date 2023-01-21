// don't forget to add .js file extensions
// otherwise, won't work
import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// Launch app
document.addEventListener("readystatechange", (event) => {

    if (event.target.readyState === "complete") {
        initApp();
    }    
});

const initApp = () => {

    // Add listeners;
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        // prevents reloaidng everything in the dom when submitting the form
        event.preventDefault();
        // procedural function
        processSubmission();
    });

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", (event) => {

        const list = toDoList.getList();
        if(list.length) {
            const confirmed = confirm("Are you sure you want to clear the entire list?");
            if (confirmed) {
               toDoList.clearList(); 
               // update persistent data
                updatePersistentData(toDoList.getList());
               refreshThePage();
            }
        }
    });
    // Procedural: things we want to do when app loads
    // load list object (especially if we store any persistent data)
    // if use a web storage api to do that, we would want to load list 
    // items out of there, if we use the app again (so list items are
    // still there)
    loadListObject();

    // refresh the page
    refreshThePage();

};

const loadListObject = () => {

    const storedList = localStorage.getItem("myToDoList");
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    // not just pulling the data out, need to pull methods also
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    });
}


const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
};

// deletes all child elements of a parent element
// commonly used in webapps
const deleteContents = (parentElement) => {

    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
    list.forEach((item) => {
        buildListItem(item);
    });
};

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabindex = 0;
    addClickListenerToCheckbox(check);
    // want to add click listener to checkbox
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
};

// TODO: Try to add functionalsuch that you can see the completed items
// later
const addClickListenerToCheckbox = (checkbox) => {

    checkbox.addEventListener("click", (event) => {
        toDoList.removeItemFromList(checkbox.id);
        const removedText = getLabelText(checkbox.id);
        updatePersistentData(toDoList.getList());
        updateScreenReaderConfirmation(removedText, "removed");
        // 1000 is in ms, so 1s.
        // Delays actual removal of the checked item to relish a completed task
        setTimeout(() => {
            refreshThePage();
        }, 100);
    });    
};

const getLabelText = (checkbox_id) => {
    return document.getElementById(checkbox_id).nextElementSibling.textContent;
}

const updatePersistentData = (listArray) => {
    // localstorage works better with JSON
    // localstorage can only store strings
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
}

// clears text input box
const clearItemEntryField = () => {

    document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    // update persistent data
    updatePersistentData(toDoList.getList());
    updateScreenReaderConfirmation(newEntryText, "added");
    refreshThePage();
}

const getNewEntry = () => {
    // trim gets rid of the unnecessary whitespace on the right/left
    return document.getElementById("newItem").value.trim();
}

const calcNextItemId = () => {
    // if list is empty
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (nextItemId, newEntryText) => {
    const item = new ToDoItem();
    item.setId(nextItemId);
    item.setItem(newEntryText);
    return item;
    
};

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
    document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}`;
};