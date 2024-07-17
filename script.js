document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const taskList = document.getElementById('task-list');

    const taskText = taskInput.value.trim();
    const taskDateTimeValue = taskDatetime.value.trim();
    
    // Ensure both task text and date-time are provided
    if (taskText === '' || taskDateTimeValue === '') {
        alert('Please enter both task and date-time.');
        return;
    }
    
    // Split the date-time value into date and time parts
    const [taskDate, taskTime] = taskDateTimeValue.split('T');
    
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <div class="task-details">
            <p class="task-date">${getFormattedDate(taskDate)}</p>
            <p class="task-time">${getFormattedTime(taskTime)}</p>
        </div>
        <div class="actions">
            <button onclick="markCompleted(this)">Complete</button>
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    taskList.appendChild(li);

    // Clear input fields after adding task
    taskInput.value = '';
    taskDatetime.value = '';
});

function markCompleted(button) {
    const li = button.parentElement.parentElement;
    li.classList.toggle('completed');
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    li.remove();
}

async function editTask(button) {
    const li = button.parentElement.parentElement;
    const taskTextElement = li.querySelector('span');
    const taskDateElement = li.querySelector('.task-date');
    const taskTimeElement = li.querySelector('.task-time');

    const taskText = taskTextElement.textContent.trim();
    const taskDate = taskDateElement.textContent.trim();
    const taskTime = taskTimeElement.textContent.trim();

    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText !== null) {
        const currentDateTime = `${taskDate} ${taskTime}`;
        const newTaskDateTime = await promptDateTime(currentDateTime);
        if (newTaskDateTime !== null) {
            const [newDate, newTime] = newTaskDateTime.split(' ');
            taskTextElement.textContent = newTaskText.trim();
            taskDateElement.textContent = getFormattedDate(newDate.trim());
            taskTimeElement.textContent = getFormattedTime(newTime.trim());
        }
    }
}

function promptDateTime(currentDateTime) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'datetime-local';

        // Parse currentDateTime to set the initial value
        const [datePart, timePart] = currentDateTime.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');

        // Adjust month (subtract 1 because month is zero-indexed in Date objects)
        input.value = `${year}-${month}-${day}T${hours}:${minutes}`;

        const container = document.createElement('div');
        container.appendChild(input);

        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirm';
        confirmButton.onclick = () => {
            document.body.removeChild(container);
            resolve(input.value.replace('T', ' '));
        };

        container.appendChild(confirmButton);
        document.body.appendChild(container);
    });
}


function getFormattedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getFormattedTime(timeString) {
    const date = new Date(`2000-01-01T${timeString}`);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
}


