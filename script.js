// Funcția de a salva sarcinile în localStorage
function saveTasks() {
    const tasks = [];
    const taskList = document.getElementById("taskList");
    for (let i = 0; i < taskList.children.length; i++) {
        tasks.push(taskList.children[i].innerText.replace(' Șterge', ''));
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funcția de a încărca sarcinile din localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(taskText => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="fas fa-check-circle"></i>${taskText}`;

            li.onclick = () => li.classList.toggle("done");

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Șterge`;
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                li.remove();
                saveTasks(); // Salvează după ce ștergi
            };

            li.appendChild(deleteBtn);
            document.getElementById("taskList").appendChild(li);
        });
    }
}

// Funcția de a adăuga o sarcină
function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText === "") return;

    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-check-circle"></i>${taskText}`;

    li.onclick = () => li.classList.toggle("done");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Șterge`;
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks(); // Salvează după ce ștergi
    };

    li.appendChild(deleteBtn);
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveTasks(); // Salvează după ce adaugi
}

// Funcția pentru a obține vremea
async function getWeather(city, elementId) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=74152694ee8f4f5a832151831252804&q=${city}&lang=ro`);
        const data = await response.json();
        
        if (data.error) {
            console.error('Eroare la obținerea vremii:', data.error.message);
        } else {
            const weatherElement = document.getElementById(elementId);
            const weatherDescription = data.current.condition.text;
            const temperature = data.current.temp_c;
            const weatherIconCode = data.current.condition.icon;

            const weatherIconUrl = `https:${weatherIconCode}`;

            weatherElement.innerHTML = `<img src="${weatherIconUrl}" alt="${weatherDescription}" style="width: 50px; height: 50px;"/> Vremea în ${city}: ${weatherDescription}, ${temperature}°C`;

            // Stocăm vremea în localStorage
            localStorage.setItem(`${city}-weather`, JSON.stringify({ weatherDescription, temperature, weatherIconUrl }));
        }
    } catch (error) {
        console.error("Eroare la cererea API:", error);
    }
}

// Încărcarea vremii la refresh
function loadWeather() {
    const cities = ['Ramnicu Valcea', 'Bunesti'];
    cities.forEach(city => {
        const savedWeather = localStorage.getItem(`${city}-weather`);
        if (savedWeather) {
            const data = JSON.parse(savedWeather);
            const weatherElement = document.getElementById(`current-weather-${city.toLowerCase().replace(' ', '-')}`);
            weatherElement.innerHTML = `<img src="${data.weatherIconUrl}" alt="${data.weatherDescription}" style="width: 50px; height: 50px;"/> Vremea în ${city}: ${data.weatherDescription}, ${data.temperature}°C`;
        } else {
            getWeather(city, `current-weather-${city.toLowerCase().replace(' ', '-')}`);
        }
    });
}

// Funcția de a actualiza ora curentă
function updateTime() {
    const timeElement = document.getElementById('current-time');
    const currentTime = new Date().toLocaleTimeString();
    timeElement.textContent = `Ora curentă: ${currentTime}`;
    localStorage.setItem('current-time', currentTime); // Salvează ora curentă în localStorage
}

// Funcția de a încărca ora curentă
function loadTime() {
    const savedTime = localStorage.getItem('current-time');
    if (savedTime) {
        document.getElementById('current-time').textContent = `Ora curentă: ${savedTime}`;
    }
}

// Funcția pentru a șterge ultima sarcină (Backspace)
function deleteLastTask() {
    const taskList = document.getElementById('taskList');
    if (taskList.children.length > 0) {
        taskList.removeChild(taskList.lastElementChild);
        saveTasks(); // Salvează după ce ștergi
    }
}

// Inițializare
document.addEventListener("DOMContentLoaded", function () {
    loadTasks(); // Încărcăm sarcinile din localStorage
    loadWeather(); // Încărcăm vremea
    loadTime(); // Încărcăm ora curentă
    setInterval(updateTime, 1000); // Actualizăm ora la fiecare secundă
    setInterval(() => loadWeather(), 3600000); // Actualizăm vremea la fiecare oră

    // Adăugarea sarcinilor
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Funcția pentru ștergerea ultimei sarcini la apăsarea Backspace
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && document.getElementById('taskInput').value === '') {
            deleteLastTask();
        }
    });
});
