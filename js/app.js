// TODO 1: Create variables to track application state (dreams array, selected mood, etc.)
// TODO 2: Check for and load any saved preferences from localStorage (theme preference, existing dreams)
// TODO 3: Write a function to initialize the UI on page load (display saved dreams if they exist, set correct theme)
// TODO 4: Create an event listener for the theme toggle button that switches between light/dark modes
// TODO 5: Add event listeners to the dream content textarea to count words as the user types
// TODO 6: Implement event listeners for the mood selector buttons to track which mood is selected
// TODO 7: Create a form validation function that enables/disables the save button based on if required fields are filled
// TODO 8: Write a function to save dreams that:
//    - Creates a new dream object with all form data
//    - Adds it to your dreams array
//    - Saves the updated array to localStorage
//    - Resets the form
// TODO 9: Implement a function to display the saved dreams that:
//    - Checks if there are any dreams to display
//    - Updates the dream count
//    - Creates HTML for each dream in the list
//    - Adds proper security by escaping HTML in user content
// TODO 10: Add a function to show a "saved successfully" message that disappears after a few seconds
// TODO 11: Connect all your functions with the appropriate event listeners
// TODO 12: Add a helper function to prevent XSS attacks by escaping HTML in user input

// Dom elements
// const dreamEntry = document.getElementById("dream-entry");
const themeToggle = document.getElementById("themeToggle");
const dreamTitle = document.getElementById("dreamTitle");
const dreamContent = document.getElementById("dreamContent");
const moodOptions = document.querySelectorAll(".mood-option");
const wordCount = document.getElementById("wordCount");
const dreamList = document.getElementById("dreamList");
const dreamItems = document.getElementById("dreamItems");
const dreamCount = document.getElementById("dreamCount");
const saveDreamBtn = document.getElementById("saveDreamBtn");

// State
let selectedMood = "neutral";
const dreamsArray = [];

document.addEventListener("DOMContentLoaded", () => {
  const { theme, dreams } = loadPreferences();
  applyTheme(theme);
  loadDreams().forEach((dream) => dreamsArray.unshift(dream));
  renderDreams(dreams);
  toggleSaveButton();
  initializeApplication();
});

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
  // Get theme or load `light` if no preference found
  const theme = localStorage.getItem("theme") || "light";
  // Load dreams from localStorage into current browsing session via dreamsArray
  const dreams = loadDreams();

  return { theme, dreams };
}

document.getElementById("themeToggle").addEventListener("click", applyTheme);

function applyTheme(theme) {
  if (theme !== "light") {
    document.body.classList.toggle("dark-mode");
  }
}

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

function handleMoodChange(mood) {
  switch (mood) {
    case "happy":
      mood.classList.add("happy");
      break;
    case "scared":
      mood.classList.add("scared");
      break;
    case "sad":
      mood.classList.add("sad");
      break;
    case "content":
      mood.classList.add("content");
      break;
    case "neutral":
      mood.classList.add("neutral");
      break;
  }
}

function saveUserDreams(dreams) {
  localStorage.setItem("user-dreams", JSON.stringify(dreams));
  console.log("Saved dream to local storage:", dreams);
}

function addDream(dream) {
  dreamsArray.unshift(dream);
  saveUserDreams(dreamsArray);
  console.log("Dream added, current dreams:", dreamsArray);
}

function loadDreams() {
  // Load any dreams from
  const savedDreams = localStorage.getItem("user-dreams");
  return savedDreams ? JSON.parse(savedDreams) : [];
}

function renderDreams(dreams) {
  if (!dreams) return;

  console.log("dreams element:", dreams);
  const currentDreams = loadDreams();

  // Update dream count
  if (dreamCount) {
    dreamCount.textContent = `${currentDreams.length}`;
  }

  // Show dream list if we have any dreams
  if (currentDreams.length > 0) {
    dreamList.classList.remove("hidden");
    dreamList.style.display = "block";
  }

  let html = "";
  currentDreams.forEach((dream) => {
    html += `
    <div class="dream-item">
      <h3>${escapeHtml(dream.title)}</h3>
      <p>Mood: ${escapeHtml(dream.mood)}</p>
      <p>Content: ${escapeHtml(dream.content)}</p>
    </div>
  `;
  });
  dreams.innerHTML = html;
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

saveDreamBtn.addEventListener("click", () => {
  const dream = {
    title: dreamTitle.value,
    content: dreamContent.value,
    mood: selectedMood,
  };

  addDream(dream);
  renderDreams(dreamItems);
  console.log("Dream Added! 🌈🧠🎉");
  showRecentDreams();
});

function showRecentDreams() {
  dreamList.classList.toggle("hidden");
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
