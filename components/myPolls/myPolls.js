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
      pollElement.innerHTML = `
        <div class="border border-dark-subtle rounded p-3 d-flex flex-column gap-2">
          <div class='d-flex flex-column'>
            <div style="color: gray;">Question</div>
            <div>${pollItem.poll_question}</div>
          </div>

          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-primary">Edit</button>
            <button type="button" class="btn btn-outline-danger">Delete</button>
          </div>
        </div>
      `;
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

testNoPollsButton.addEventListener('click', () => {
  handleButtonClick(testNoPollsButton, 'invalid-device-id');
});

testHasPollsButton.addEventListener('click', () => {
  handleButtonClick(testHasPollsButton, 'device_dqz5bq9');
});
