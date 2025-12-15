document.addEventListener("DOMContentLoaded", () => {

    console.log("oneTask.js loaded!");
    console.log("Initial seconds:", window.taskDurationSeconds);

    const timerDisplay = document.getElementById("timer");

    if (!timerDisplay) {
        console.error("❌ ERROR: #timer element not found in DOM.");
        return;
    }

    let totalSeconds = window.taskDurationSeconds;

    function updateTimer() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timerDisplay.innerText =
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "✔️ Task Complete!";
        }

        totalSeconds--;
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

});
