// TODO 8: Write a function to save dreams that:
//    - Resets the form
// TODO 10: Add a function to show a "saved successfully" message that disappears after a few seconds
import { v4 as uuidv4 } from "uuid";

// Dom elements
const themeToggle = document.getElementById("themeToggle");
const dreamTitle = document.getElementById("dreamTitle");
const dreamContent = document.getElementById("dreamContent");
const moodOptions = document.querySelectorAll(".mood-option");
const wordCount = document.getElementById("wordCount");
const dreamsList = document.getElementById("dreamsList");
const dreamItems = document.getElementById("dreamItems");
let dreamCountElement = document.getElementById("dreamCount");
const saveDreamBtn = document.getElementById("saveDreamBtn");

// Setting initial state
let selectedMood = "neutral";
let dreamsArray = [];
let dreamCount = dreamCountElement
  ? parseInt(dreamCountElement.textContent, 10)
  : 0;

// Loading initial state
document.addEventListener("DOMContentLoaded", () => {
  const { theme, dreams } = loadPreferences();
  console.log("Loaded preferences.");
  applyTheme(theme);

  // Set dreams array to what we loaded
  dreamsArray = dreams;

  // Initialize dream count
  updateDreamCount(dreamsArray.length);

  // Render dreams list
  renderDreamsList(dreamsArray);
  toggleSaveButton();
  initializeApplication();
});

// Initializing preferences & dreams
function initializeApplication() {
  const preferences = loadPreferences();

  if (preferences !== undefined) {
    console.log("Theme: ", preferences.theme);
    console.log("Dreams: ", preferences.dreams);
  } else {
    console.log("No preferences found.");
  }
  console.log("Application initialized");
}

function loadPreferences() {
  // Get theme or load `light` if no previously saved theme found
  const theme = localStorage.getItem("theme") || "light";
  // Load dreams from localStorage into current browsing session via dreamsArray
  const dreams = loadDreams();

  return { theme, dreams };
}

// Light / Dark Mode theme logic
function getActiveTheme() {
  return document.body.classList.contains("dark-mode") ? "light" : "dark-mode";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark-mode");
}

function saveTheme(theme) {
  localStorage.setItem("theme", theme === "dark-mode" ? "dark-mode" : "");
}

themeToggle.addEventListener("click", handleThemeToggle);

// Change theme on click
function handleThemeToggle() {
  const currentTheme = getActiveTheme();
  saveTheme(currentTheme);
  applyTheme(currentTheme);
}

// Mood button logic
moodOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Remove selected mood class from all options
    moodOptions.forEach((opt) => opt.classList.remove("selected"));
    // Add selected mood class to clicked mood
    option.classList.add("selected");
    // Update selected mood
    selectedMood = option.dataset.mood;
    handleMoodChange(option);
  });
});

function handleMoodChange(moodElement) {
  const moodEmoji = moodElement.dataset.mood;
  let moodClass;

  switch (moodEmoji) {
    case "😊":
      moodClass = "happy";
      break;
    case "😨":
      moodClass = "scared";
      break;
    case "😭":
      moodClass = "sad";
      break;
    case "😌":
      moodClass = "peaceful";
      break;
    case "😐":
      moodClass = "neutral";
      break;
  }
}

function loadDreams() {
  // Load `savedDreams` from `localStorage`
  const savedDreams = localStorage.getItem("user-dreams");
  // Parse `savedDreams` as JSON if it exists, otherwise return an empty array
  console.log("Dreams loaded: ", savedDreams);
  return savedDreams ? JSON.parse(savedDreams) : [];
}

// Add event listeners and validation to `Save Dream` button
document
  .getElementById("dreamTitle")
  .addEventListener("input", toggleSaveButton);
document
  .getElementById("dreamContent")
  .addEventListener("input", toggleSaveButton);

function toggleSaveButton() {
  saveDreamBtn.disabled = !(
    dreamTitle.value.trim() !== "" && dreamContent.value.trim() !== ""
  );
}

function renderDreamsList(dreams) {
  // Check if the array is empty (but still valid)
  if (!dreams || dreams.length === 0) {
    dreamItems.innerHTML = `<p class="no-dreams">No dreams recorded yet!</p>`;
    return;
  }

  // Show dreams list if we have any dreams
  dreamsList.classList.remove("hidden");
  dreamsList.style.display = "block";

  let html = "";
  dreams.forEach((dream, index) => {
    html += `
      <div class="dream-item">
        <div class="dream-item-header" id="dreamItemHeader">
          <h3>${escapeHtml(dream.title)}</h3>
          <button type="button" class="del-button" id="deleteDreamBtn" data-index="${index}">
            <span>❌</span>
          </button>
        </div>
        <p>Mood: ${escapeHtml(dream.mood)}</p>
        <p>Content: ${escapeHtml(dream.content)}</p>
      </div>
    `;
  });
  dreamItems.innerHTML = html;

  // Update dream count
  updateDreamCount(dreams.length);

  // Add event listeners to delete buttons
  addDeleteEventListeners();
}

dreamContent.addEventListener("input", updateWordCount);

function getWordCount(text) {
  return text.split(" ").length;
}

function updateWordCount() {
  // Get text from <textarea>
  const text = dreamContent.value;
  const count = getWordCount(text);
  wordCount.textContent = `${count} words`;
}

function updateDreamCount(newCount) {
  if (dreamCountElement) {
    dreamCountElement.textContent = newCount || 0;
  } else {
    console.error("Invalid input for dreamCount");
  }
}

updateDreamCount();

function validateDream(dream) {
  return dream.title && dream.content && dream.mood;
}

function updateUI() {
  saveDreamBtn.disabled = !validateDream({
    title: dreamTitle.value,
    content: dreamContent.value,
    mood: selectedMood,
  });
  wordCount.textContent = `${getWordCount(dreamContent.value)} words`;
  renderDreamsList(dreamsArray);
}

saveDreamBtn.addEventListener("click", () => {
  const dream = {
    title: dreamTitle.value,
    content: dreamContent.value,
    mood: selectedMood,
    uuid: uuidv4(),
  };
  if (validateDream(dream)) {
    handleSaveDream(dream);
    renderDreamsList(dreamsArray);
    updateUI();
  } else {
    alert("Please fill in all fields.");
  }
});

// Add eventListeners to all delete buttons
function addDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll("#deleteDreamBtn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteDream);
  });
}

function handleDeleteDream(event) {
  const index = parseInt(event.currentTarget.getAttribute("data-index"));

  // Remove dream from array
  dreamsArray.splice(index, 1);

  // Update localStorage
  localStorage.setItem("user-dreams", JSON.stringify(dreamsArray));

  // Re-render dreams list
  renderDreamsList(dreamsArray);
  updateUI();
  console.log("Dream deleted successfully");
}

// Saves dream to local storage
function handleSaveDream() {
  // event.preventDefault();

  const newDream = {
    title: dreamTitle.value,
    content: dreamContent.value,
    mood: selectedMood,
    uuid: uuidv4(),
  };

  try {
    const dreamsData = localStorage.getItem("user-dreams");

    if (dreamsData) {
      dreamsArray = JSON.parse(dreamsData);
    }

    addDream(newDream);
    localStorage.setItem("user-dreams", JSON.stringify(dreamsArray));
    console.log(
      "newDream entries saved from session to localStorage! 🌈🧠🎉",
      newDream,
    );

    renderDreamsList(dreamsArray);
    showRecentDreams();

    return true;
  } catch (error) {
    console.error("Invalid Dream data... 💭😶‍🌫️💭");

    return false;
  }
}

function addDream(dream) {
  dreamsArray.unshift(dream);
  // saveUserDreams(dreamsArray);
  console.log("newDream added to front of dreamsArray");
}

function showRecentDreams() {
  dreamsList.classList.toggle("hidden");
}

// Helper function to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
