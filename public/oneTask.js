document.addEventListener("DOMContentLoaded", () => {
  console.log("oneTask.js loaded!");
  console.log("Initial seconds:", window.taskDurationSeconds);

  const timerDisplay = document.getElementById("timer");
  const modal = document.getElementById("timeUpModal");
  const addTimeBtn = document.getElementById("addTimeBtn");

  if (!timerDisplay) {
    console.error("❌ ERROR: #timer element not found.");
    return;
  }

  if (!modal) {
    console.error("❌ ERROR: #timeUpModal missing.");
  }

  let totalSeconds = window.taskDurationSeconds;
  let timerInterval = null;

  // END NOW BUTTON — triggers modal instantly
  const endNowBtn = document.getElementById("endNowBtn");

  if (endNowBtn) {
    endNowBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      modal.classList.remove("hidden");
      timerDisplay.innerText = "⏹️ Timer Stopped Early";
    });
  }

  function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    timerDisplay.innerText =
      `${hours.toString().padStart(2, "0")}:` +
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerDisplay.innerText = "✔️ Task Complete!";
      modal.classList.remove("hidden");
      return;
    }

    totalSeconds--;
  }

  // Start timer
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);

  // ---------------------------
  // ADD EXTRA TIME
  // ---------------------------
  if (addTimeBtn) {
    addTimeBtn.addEventListener("click", () => {
      let extra = prompt("How many additional minutes?");
      extra = parseInt(extra, 10);

      if (isNaN(extra) || extra <= 0) {
        alert("Invalid number.");
        return;
      }

      totalSeconds += extra * 60;

      modal.classList.add("hidden");

      // restart timer safely
      clearInterval(timerInterval);
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    });
  }

  // Complete / Fail buttons are handled via form POSTs (server-side)
});
