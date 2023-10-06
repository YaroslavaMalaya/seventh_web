class TodoItem { 
    constructor(taskText, date) { 
        this.taskText = taskText; 
        this.date = date; 
    } 
} 
 
class TodoItemPremium extends TodoItem { 
    constructor(taskText, date, image) { 
        super(taskText, date); 
        this.image = image; 
    } 
}

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("task");
    const add = document.getElementById("add");
    const tasks = document.getElementById("tasks");
    const removeCompleted = document.getElementById("removeCompleted");
    const removeAll = document.getElementById("removeAll");

    add.addEventListener("click", addTask);
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    function addTask() {
        const taskText = input.value.trim();
        const currentDate = new Date();
        if (taskText !== "") {
            const taskItem = document.createElement("li");
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();
            const date = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            taskItem.innerHTML = `
                <div id="item">
                <p id="date">${date}</p>
                <div id="textitem">
                    <input type="checkbox" class="check">
                    <span id="text1">${taskText}</span>
                </div>
                <button class="delete">Delete</button>
                </div>
            `;
            
            tasks.insertBefore(taskItem, tasks.firstChild);
            input.value = "";
            checkAndCrossText(taskItem);

            const deleteButton = taskItem.querySelector(".delete");
            deleteButton.addEventListener("click", function () {
                taskItem.remove();
            });

            const textitemDiv = taskItem.querySelector("#item");
            textitemDiv.addEventListener("dblclick", function() {
                const textSpan = textitemDiv.querySelector("#text1");
                const originalText = textSpan.textContent;
                const editInput = document.createElement("input");
                editInput.value = originalText;
                editInput.id = "editInput";
                textSpan.textContent = "";
                textSpan.appendChild(editInput);
                editInput.focus();

                editInput.addEventListener("keydown", function(event) {
                    if (event.key === "Enter") {
                        const newText = editInput.value.trim();
                        textSpan.textContent = newText;
                        updateDateAndMoveToTop(taskItem);
                    } else if (event.key === "Escape") {
                        textSpan.textContent = originalText;
                    }
                });
            });
        } else {
            alert('Please, fill in the box and then click Add.');
        }
    }

    function checkAndCrossText(taskItem) {
        const checkbox = taskItem.querySelector(".check");
        const label = taskItem.querySelector("span");

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                label.style.textDecoration = "line-through";
            } else {
                label.style.textDecoration = "none";
            }
        });
    }

    function updateDateAndMoveToTop(taskItem) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const date = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    
        const dateElement = taskItem.querySelector("#date");
        dateElement.textContent = date;
        tasks.insertBefore(taskItem, tasks.firstChild);
    }

    removeCompleted.addEventListener("click", function () {
        const completedTasks = tasks.querySelectorAll("li");
        completedTasks.forEach(function (taskItem) {
            const checkbox = taskItem.querySelector(".check");
            if (checkbox.checked) {
                taskItem.remove();
            }
        });
    });

    removeAll.addEventListener("click", function () {
        const taskItems = tasks.querySelectorAll("li");
        let hasUncheckedTasks = false;

        taskItems.forEach(function (taskItem) {
            const checkbox = taskItem.querySelector(".check");
            if (!checkbox.checked) {
                hasUncheckedTasks = true;
                return;
            }
        });

        if (hasUncheckedTasks) {
            const confirmDelete = confirm("Are you sure you want to delete all tasks?");
            if (confirmDelete) {
                taskItems.forEach(function (taskItem) {
                    taskItem.remove();
                });
            }
        } else {
            taskItems.forEach(function (taskItem) {
                    taskItem.remove();
                });
        }
    });

    let isSorted = true; 
    const sortButton = document.getElementById("sortButton"); 
    sortButton.addEventListener("click", function () { 
        const allTasks = Array.from(tasks.children); 
        allTasks.sort((a, b) => { 
            const dateA = new Date(a.querySelector("#date").textContent); 
            const dateB = new Date(b.querySelector("#date").textContent); 
            // If (dateA - dateB) is negative: dateA comes before dateB, if it's positive dateB comes before dateA 
            return isSorted ? dateA - dateB : dateB - dateA;  
        }); 
        allTasks.forEach(task => tasks.appendChild(task)); 
        isSorted = !isSorted; 
    });

});
