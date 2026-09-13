// ==============================
// START STUDYING
// ==============================

function startStudying() {
    document.getElementById("message").textContent =
        "Let's do this! 💪📚";
}


// ==============================
// SUBJECTS
// ==============================

let completedSubjects =
    Number(localStorage.getItem("progress")) || 0;

function chooseSubject(subject) {
    document.getElementById("selectedSubject").textContent =
        "You selected " + subject + " 📚";

    localStorage.setItem("selectedSubject", subject);
}

function completeSubject(card) {

    if (card.classList.contains("completed")) {
        card.classList.remove("completed");
        completedSubjects--;
    } else {
        card.classList.add("completed");
        completedSubjects++;
    }

    updateOverallSubjectProgress();
    saveSubjectProgress();
}

function saveSubjectProgress() {

    let completed = [];

    document.querySelectorAll(".subject").forEach(function(subject) {
        completed.push(
            subject.classList.contains("completed")
        );
    });

    localStorage.setItem(
        "subjectProgress",
        JSON.stringify(completed)
    );

    localStorage.setItem(
        "progress",
        completed.filter(Boolean).length
    );
}

function loadSubjectProgress() {

    let saved =
        localStorage.getItem("subjectProgress");

    if (saved === null) return;

    let completed = JSON.parse(saved);

    document.querySelectorAll(".subject").forEach(function(subject, index) {

        if (completed[index]) {
            subject.classList.add("completed");
        }

    });

    completedSubjects =
        document.querySelectorAll(".subject.completed").length;
}

function updateOverallSubjectProgress() {

    let subjects =
        document.querySelectorAll(".subject");

    let completed =
        document.querySelectorAll(".subject.completed").length;

    let percentage =
        subjects.length === 0
            ? 0
            : (completed / subjects.length) * 100;

    document.getElementById("progress").textContent =
        "Progress = " + percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("statSubjects").textContent =
        percentage + "%";
}


// ==============================
// STUDY TIMER
// ==============================

let timer = null;
let timeLeft = 25 * 60;

function startTimer() {

    if (timer) return;

    timer = setInterval(function() {

        if (timeLeft <= 0) {

            clearInterval(timer);
            timer = null;

            document.getElementById("timerDisplay").textContent =
                "Time's up! 🎉";

            return;
        }

        timeLeft--;

        updateTimerDisplay();

    }, 1000);
}

function pauseTimer() {

    clearInterval(timer);
    timer = null;
}

function resetTimer() {

    clearInterval(timer);
    timer = null;

    timeLeft = 25 * 60;

    updateTimerDisplay();
}

function setTimer(minutes) {

    clearInterval(timer);
    timer = null;

    timeLeft = minutes * 60;

    updateTimerDisplay();
}

function updateTimerDisplay() {

    let minutes =
        Math.floor(timeLeft / 60);

    let seconds =
        timeLeft % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("timerDisplay").textContent =
        minutes + ":" + seconds;
}


// ==============================
// DAILY STUDY GOAL
// ==============================

let studyMinutes =
    Number(localStorage.getItem("studyMinutes")) || 0;

function updateStudyGoal() {

    document.getElementById("studyTime").textContent =
        "Studied: " + studyMinutes + " minutes";

    document.getElementById("statStudy").textContent =
        studyMinutes;

    let percentage =
        (studyMinutes / 120) * 100;

    if (percentage > 100) {
        percentage = 100;
    }

    document.getElementById("goalBar").style.width =
        percentage + "%";

    localStorage.setItem(
        "studyMinutes",
        studyMinutes
    );
}

function addStudyTime() {

    studyMinutes += 30;

    updateStudyGoal();
}

function removeStudyTime() {

    studyMinutes -= 30;

    if (studyMinutes < 0) {
        studyMinutes = 0;
    }

    updateStudyGoal();
}

function addTimerStudyTime() {

    studyMinutes += 25;

    updateStudyGoal();
}


// ==============================
// 25-MINUTE STUDY SESSION
// ==============================

function startStudySession() {

    setTimer(25);

    if (timer) return;

    timer = setInterval(function() {

        if (timeLeft <= 0) {

            clearInterval(timer);
            timer = null;

            addTimerStudyTime();

            document.getElementById("timerDisplay").textContent =
                "Time's up! 🎉";

            document.getElementById("message").textContent =
                "Amazing! 25 minutes completed! 🎉📚";

            return;
        }

        timeLeft--;

        updateTimerDisplay();

    }, 1000);
}


// ==============================
// TASKS
// ==============================

function addTask() {

    let input =
        document.getElementById("taskInput");

    let text =
        input.value.trim();

    if (text === "") return;

    let task =
        document.createElement("div");

    task.className = "task";

    let taskText =
        document.createElement("span");

    taskText.textContent =
        "📌 " + text;

    taskText.onclick = function() {

        task.classList.toggle("completed-task");

        saveTasks();
        updateTaskProgress();
        updateAchievements();
    };

    let deleteButton =
        document.createElement("button");

    deleteButton.textContent = "🗑️";

    deleteButton.onclick = function() {

        task.remove();

        saveTasks();
        updateTaskStat();
        updateTaskProgress();
        updateAchievements();
    };

    task.appendChild(taskText);
    task.appendChild(deleteButton);

    document
        .getElementById("taskList")
        .appendChild(task);

    input.value = "";

    saveTasks();
    updateTaskStat();
    updateTaskProgress();
    updateAchievements();
}

function saveTasks() {

    let tasks = [];

    document
        .querySelectorAll("#taskList .task")
        .forEach(function(task) {

            tasks.push({

                text:
                    task.querySelector("span").textContent,

                completed:
                    task.classList.contains("completed-task")

            });

        });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function loadTasks() {

    let saved =
        localStorage.getItem("tasks");

    if (saved === null) return;

    let tasks =
        JSON.parse(saved);

    tasks.forEach(function(savedTask) {

        let task =
            document.createElement("div");

        task.className = "task";

        if (savedTask.completed) {
            task.classList.add("completed-task");
        }

        let taskText =
            document.createElement("span");

        taskText.textContent =
            savedTask.text;

        taskText.onclick = function() {

            task.classList.toggle("completed-task");

            saveTasks();
            updateTaskProgress();
            updateAchievements();
        };

        let deleteButton =
            document.createElement("button");

        deleteButton.textContent = "🗑️";

        deleteButton.onclick = function() {

            task.remove();

            saveTasks();
            updateTaskStat();
            updateTaskProgress();
            updateAchievements();
        };

        task.appendChild(taskText);
        task.appendChild(deleteButton);

        document
            .getElementById("taskList")
            .appendChild(task);
    });
}

function updateTaskStat() {

    let total =
        document.querySelectorAll("#taskList .task").length;

    document.getElementById("statTasks").textContent =
        total;
}

function updateTaskProgress() {

    let tasks =
        document.querySelectorAll("#taskList .task");

    let completed =
        document.querySelectorAll(
            "#taskList .task.completed-task"
        );

    document.getElementById("taskProgress").textContent =
        completed.length +
        " of " +
        tasks.length +
        " completed ✅";
}

function clearTasks() {

    document.getElementById("taskList").innerHTML = "";

    localStorage.removeItem("tasks");

    updateTaskStat();
    updateTaskProgress();
    updateAchievements();
}


// ==============================
// NOTES
// ==============================

function saveNotes() {

    let notes =
        document.getElementById("notesInput").value;

    localStorage.setItem(
        "studyNotes",
        notes
    );

    document.getElementById("notesMessage").textContent =
        "Notes saved! 💜";
}

function loadNotes() {

    let saved =
        localStorage.getItem("studyNotes");

    if (saved !== null) {

        document.getElementById("notesInput").value =
            saved;
    }
}

function clearNotes() {

    document.getElementById("notesInput").value = "";

    localStorage.removeItem("studyNotes");

    document.getElementById("notesMessage").textContent =
        "Notes cleared! 🗑️";
}


// ==============================
// DARK MODE
// ==============================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    let enabled =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        enabled
    );
}

function loadDarkMode() {

    if (
        localStorage.getItem("darkMode") === "true"
    ) {
        document.body.classList.add("dark-mode");
    }
}


// ==============================
// STREAK
// ==============================

function updateStreak() {

    let today =
        new Date().toDateString();

    let lastVisit =
        localStorage.getItem("lastVisit");

    let streak =
        Number(localStorage.getItem("streak")) || 0;

    if (lastVisit === null) {
        streak = 1;
    } else if (lastVisit !== today) {
        streak++;
    }

    localStorage.setItem("lastVisit", today);
    localStorage.setItem("streak", streak);

    document.getElementById("statStreak").textContent =
        streak;
}

function updateStreakMessage() {

    let streak =
        Number(localStorage.getItem("streak")) || 1;

    let message;

    if (streak === 1) {
        message = "Great start! 🌱 Keep going!";
    } else if (streak < 7) {
        message = "You're building a habit! 🔥";
    } else if (streak < 30) {
        message = "One week+ streak! You're amazing! 🚀";
    } else {
        message = "You're unstoppable! 🏆🔥";
    }

    document.getElementById("streakMessage").textContent =
        message;
}


// ==============================
// MOTIVATION
// ==============================

function newMotivation() {

    let messages = [

        "You can do this! 💪📚",
        "One chapter at a time! 🌸",
        "Your future self will thank you! ✨",
        "Keep going, you're doing amazing! 💜",
        "Small progress is still progress! 🌱",
        "Believe in yourself! 🫶",
        "Study now, celebrate later! 🎉📖"

    ];

    let random =
        Math.floor(
            Math.random() * messages.length
        );

    document.getElementById("motivationText").textContent =
        messages[random];
}


// ==============================
// STUDY QUOTE
// ==============================

let studyQuotes = [

    "Keep learning, keep growing. 🌱",
    "Small steps every day lead to big results. ✨",
    "Focus on progress, not perfection. 💜",
    "You are capable of more than you think. 💪",
    "One page today is better than zero pages. 📖",
    "Your effort today builds your tomorrow. 🌸",
    "Keep going. You've got this! 🚀"

];

let todayQuote =
    studyQuotes[
        new Date().getDate() % studyQuotes.length
    ];


// ==============================
// CUSTOM STUDY PLAN
// ==============================

function addPlanItem() {

    let input =
        document.getElementById("planInput");

    let text =
        input.value.trim();

    if (text === "") return;

    let item =
        document.createElement("div");

    item.className = "plan-entry";

    item.textContent =
        "📚 " + text;

    document
        .getElementById("planList")
        .appendChild(item);

    input.value = "";

    savePlan();
}

function savePlan() {

    let plans = [];

    document
        .querySelectorAll(".plan-entry")
        .forEach(function(item) {

            plans.push(item.textContent);

        });

    localStorage.setItem(
        "studyPlan",
        JSON.stringify(plans)
    );
}

function loadPlan() {

    let saved =
        localStorage.getItem("studyPlan");

    if (saved === null) return;

    let plans =
        JSON.parse(saved);

    document.getElementById("planList").innerHTML = "";

    plans.forEach(function(plan) {

        let item =
            document.createElement("div");

        item.className = "plan-entry";

        item.textContent =
            plan;

        document
            .getElementById("planList")
            .appendChild(item);
    });
}


// ==============================
// EXAM COUNTDOWN
// ==============================

function saveExamDate() {

    let date =
        document.getElementById("examDate").value;

    if (date === "") return;

    localStorage.setItem(
        "examDate",
        date
    );

    updateCountdown();
}

function updateCountdown() {

    let saved =
        localStorage.getItem("examDate");

    if (saved === null) return;

    document.getElementById("examDate").value =
        saved;

    let exam =
        new Date(saved + "T00:00:00");

    let today =
        new Date();

    today.setHours(0, 0, 0, 0);

    let difference =
        exam - today;

    let days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    if (days > 0) {

        document.getElementById("countdownText").textContent =
            days + " days left! 🚀📚";

    } else if (days === 0) {

        document.getElementById("countdownText").textContent =
            "Exam is TODAY! 💜🔥";

    } else {

        document.getElementById("countdownText").textContent =
            "Exam date has passed. 📖";
    }
}


// ==============================
// ACHIEVEMENTS
// ==============================

function updateAchievements() {

    let subjects =
        document.querySelectorAll(
            ".subject.completed"
        ).length;

    let tasks =
        document.querySelectorAll(
            ".task.completed-task"
        ).length;

    let study =
        Number(
            localStorage.getItem("studyMinutes")
        ) || 0;

    let streak =
        Number(
            localStorage.getItem("streak")
        ) || 0;

    if (subjects >= 1) {
        document
            .getElementById("badgeFirst")
            .classList.add("unlocked");
    }

    if (tasks >= 5) {
        document
            .getElementById("badgeTasks")
            .classList.add("unlocked");
    }

    if (study >= 60) {
        document
            .getElementById("badgeStudy")
            .classList.add("unlocked");
    }

    if (streak >= 7) {
        document
            .getElementById("badgeStreak")
            .classList.add("unlocked");
    }
}


// ==============================
// ENTER KEY
// ==============================

document
    .getElementById("taskInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    });


// ==============================
// LOAD EVERYTHING
// ==============================

loadSubjectProgress();
loadTasks();
loadNotes();
loadDarkMode();
loadPlan();
updateStudyGoal();
updateStreak();
updateStreakMessage();
updateOverallSubjectProgress();
updateTaskStat();
updateTaskProgress();
updateCountdown();
updateAchievements();

document.getElementById("studyQuote").textContent =
    '"' + todayQuote + '"';
// ==============================
// PART 75 — HIDE SPLASH SCREEN
// ==============================

window.addEventListener("load", function() {

    setTimeout(function() {

        let splash =
            document.getElementById("splashScreen");

        if (splash) {

            splash.style.opacity = "0";

            setTimeout(function() {
                splash.style.display = "none";
            }, 500);

        }

    }, 1200);

});
