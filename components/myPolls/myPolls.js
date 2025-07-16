import { getMyPolls } from "../../scripts/api/getMyPolls.js";

let polls = null;
const cooldownTime = 2000; // 2 seconds cooldown

const container = document.getElementById("render-polls");

const testNoPollsButton = document.getElementById('test-no-polls');
const testHasPollsButton = document.getElementById('test-has-polls');
const dropdownToggle = document.getElementById('pollDropdownButton');

let activeButton = null;
let cooldown = false;

function renderPolls() {
  container.innerHTML = '';

  if (polls && polls.length > 0) {
    polls.forEach(pollItem => {
      const pollElement = document.createElement("div");
      pollElement.className = "border border-dark-subtle rounded p-3 d-flex flex-column gap-2";

      // Question content
      const questionSection = document.createElement("div");
      questionSection.className = "d-flex flex-column";
      questionSection.innerHTML = `
        <div style="color: gray;">Question</div>
        <div>${pollItem.poll_question}</div>
      `;

      // Buttons
      const buttonGroup = document.createElement("div");
      buttonGroup.className = "d-flex gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-outline-primary";
      editButton.textContent = "Edit";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-outline-danger";
      deleteButton.textContent = "Delete";

      // ✅ Hook up Delete button with the correct poll ID
      deleteButton.addEventListener('click', () => {
        handleDeletePoll(pollItem._id); // Ensure pollItem._id exists
      });

      // Append elements
      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      pollElement.appendChild(questionSection);
      pollElement.appendChild(buttonGroup);

      container.appendChild(pollElement);
    });

    container.className = 'd-flex flex-column gap-3 overflow-y-scroll';
    container.style.height = '600px';

  } else {
    const noPolls = document.createElement("div");
    noPolls.innerHTML = `
      <div class="border p-3 rounded">
        <p class="mb-0">You have not created any polls</p>
      </div>
    `;
    container.appendChild(noPolls);
    container.className = '';
    container.style.height = '';
  }
}


function updateDropdownToggle(button) {
  // Update text
  dropdownToggle.textContent = button.textContent.trim();

  // Reset dropdown button classes
  dropdownToggle.className = 'btn dropdown-toggle';

  // Add color based on which button is active
  if (button.id === 'test-no-polls') {
    dropdownToggle.classList.add('btn-danger'); // red color for no polls
  } else if (button.id === 'test-has-polls') {
    dropdownToggle.classList.add('btn-success'); // green color for has polls
  } else {
    dropdownToggle.classList.add('btn-secondary'); // default
  }
}

async function handleButtonClick(button, deviceId) {
  if (cooldown) return;
  if (activeButton === button) return;

  cooldown = true;
  activeButton = button;

  updateDropdownToggle(button);

  polls = await getMyPolls(deviceId);
  renderPolls();

  const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);
  if (!dropdownInstance) {
    bootstrap.Dropdown.getOrCreateInstance(dropdownToggle).hide();
  } else {
    dropdownInstance.hide();
  }

  setTimeout(() => {
    cooldown = false;
  }, cooldownTime);
}

import { deletePoll } from "../../scripts/api/deletePoll.js";

async function handleDeletePoll(pollId) {
  const confirmed = confirm("Are you sure you want to delete this poll?");
  if (!confirmed) return;

  try {
    await deletePoll(pollId);
    // Remove from local list and re-render
    polls = polls.filter(p => p._id !== pollId);
    renderPolls();
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete poll: " + error.message);
  }
}
testNoPollsButton.addEventListener('click', () => {
  handleButtonClick(testNoPollsButton, 'invalid-device-id');
});

testHasPollsButton.addEventListener('click', () => {
  handleButtonClick(testHasPollsButton, 'device_dqz5bq9');
});
