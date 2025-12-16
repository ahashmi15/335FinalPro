document.addEventListener("DOMContentLoaded", () => {
  console.log("oneTask.js loaded!");
  console.log("Initial seconds:", window.taskDurationSeconds);

  const timerDisplay = document.getElementById("timer");
  const modal = document.getElementById("timeUpModal");
  const addTimeBtn = document.getElementById("addTimeBtn");
  const endNowBtn = document.getElementById("endNowBtn");

  if (!timerDisplay) {
    console.error("❌ ERROR: #timer element not found.");
    return;
  }

  let totalSeconds = window.taskDurationSeconds;
  let timerInterval = null;

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
      modal.classList.remove("hidden");
      return;
    }

    totalSeconds--;
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);

  if (addTimeBtn) {
    addTimeBtn.addEventListener("click", () => {
      let extra = parseInt(prompt("How many additional minutes?"), 10);
      if (!extra || extra <= 0) return;

      totalSeconds += extra * 60;
      modal.classList.add("hidden");

      clearInterval(timerInterval);
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    });
  }

  const objectiveItems = Array.from(
    document.querySelectorAll(".objective-item")
  );
  const currentObjectiveBox = document.getElementById("currentObjective");

  let currentIndex = 0;

  function setCurrentObjective(index) {
    const item = objectiveItems[index];
    if (!item || item.classList.contains("completed-objective")) return;

    objectiveItems.forEach(el =>
      el.classList.remove("current-objective")
    );

    item.classList.add("current-objective");
    currentObjectiveBox.innerText = item.innerText;
    currentIndex = index;
  }

  
  if (objectiveItems.length > 0) {
    setCurrentObjective(0);
  }

  objectiveItems.forEach((item, index) => {
   
    item.addEventListener("click", () => {
      setCurrentObjective(index);
    });

    
    item.addEventListener("dblclick", () => {
      item.classList.add("completed-objective");
      item.classList.remove("current-objective");

     
      const nextIndex = objectiveItems.findIndex(
        (el, i) => i > index && !el.classList.contains("completed-objective")
      );

      if (nextIndex !== -1) {
        setCurrentObjective(nextIndex);
      } else {
        
        currentObjectiveBox.innerText = "All Objectives Completed";
      }
    });
  });
});
