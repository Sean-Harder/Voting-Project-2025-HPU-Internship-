import { getMyPolls } from "../../scripts/api/getMyPolls.js";
import { deletePoll } from "../../scripts/api/deletePoll.js";
import { editPoll } from "../../scripts/api/editPoll.js";

window.currentEditingPollId = null;

let polls = [];
const cooldownTime = 2000;
let activeButton = null,
  cooldown = false;

const container = document.getElementById("render-polls");
const testNoPollsButton = document.getElementById("test-no-polls");
const testHasPollsButton = document.getElementById("test-has-polls");
const dropdownToggle = document.getElementById("pollDropdownButton");

// Button event bindings
testNoPollsButton.addEventListener("click", () =>
  handleButtonClick(testNoPollsButton, "invalid-device-id")
);
testHasPollsButton.addEventListener("click", () =>
  handleButtonClick(testHasPollsButton, "device_dqz5bq9")
);

// Fetch and render polls
async function handleButtonClick(button, deviceId) {
  if (cooldown || activeButton === button) return;
  cooldown = true;
  activeButton = button;

  dropdownToggle.textContent = button.textContent.trim();
  dropdownToggle.className =
    button.id === "test-no-polls"
      ? "btn btn-danger"
      : button.id === "test-has-polls"
      ? "btn btn-success"
      : "btn btn-secondary";

  polls = (await getMyPolls(deviceId)) || [];
  renderPolls();

  bootstrap.Dropdown.getOrCreateInstance(dropdownToggle).hide();
  setTimeout(() => (cooldown = false), cooldownTime);
}

// Delete poll
async function handleDeletePoll(pollId) {
  if (!confirm("Are you sure you want to delete this poll?")) return;
  try {
    await deletePoll(pollId);
    polls = polls.filter((p) => p._id !== pollId);
    renderPolls();
  } catch (err) {
    alert("Failed to delete poll: " + err.message);
  }
}

// Render poll list
function renderPolls() {
  container.innerHTML = "";

  if (polls.length > 0) {
    polls.forEach((pollItem) => {
      const pollDiv = document.createElement("div");
      pollDiv.className =
        "border border-dark-subtle rounded p-3 d-flex flex-column gap-2";

      const details = document.createElement("div");
      details.className = "d-flex flex-column gap-1";
      details.innerHTML = `
        <div style="color: gray;">Question</div>
        <div>${pollItem.poll_question}</div>
        <div style="color: gray;">Description</div>
        <div>${pollItem.poll_description || ""}</div>
        <div style="color: gray;">Options</div>
        <div>${(pollItem.poll_options || []).join(", ")}</div>
      `;

      const btnGroup = document.createElement("div");
      btnGroup.className = "d-flex gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-outline-primary";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        document.getElementById("pollQuestion").value =
          pollItem.poll_question || "";
        document.getElementById("pollDescription").value =
          pollItem.poll_description || "";
        document.getElementById("pollOptions").value =
          (pollItem.poll_options || []).join(", ");

        window.currentEditingPollId = pollItem._id;

        const submitBtn = document.querySelector("#createPoll .btn-primary");
        if (submitBtn) submitBtn.textContent = "Update Poll";

        document
          .getElementById("createPoll")
          .scrollIntoView({ behavior: "smooth" });
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-outline-danger";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () =>
        handleDeletePoll(pollItem._id)
      );

      btnGroup.append(editButton, deleteButton);
      pollDiv.append(details, btnGroup);
      container.append(pollDiv);
    });

    container.className = "d-flex flex-column gap-3 overflow-y-scroll";
    container.style.height = "600px";
  } else {
    container.innerHTML = `
      <div class="border p-3 rounded">  
        <p class="mb-0">You have not created any polls</p>
      </div>`;
    container.className = "";
    container.style.height = "";
  }
}

// ✅ Update poll in place after edit
function updatePollInUI(updatedPoll) {
  const index = polls.findIndex((p) => p._id === updatedPoll._id);
  if (index !== -1) {
    polls[index] = updatedPoll;
    renderPolls();
  }
}

window.updatePollInUI = updatePollInUI;

window.clearPoll = function () {
  document.getElementById("pollQuestion").value = "";
  document.getElementById("pollDescription").value = "";
  document.getElementById("pollOptions").value = "";
  window.currentEditingPollId = null;

  const submitBtn = document.querySelector("#createPoll .btn-primary");
  if (submitBtn) submitBtn.textContent = "Submit";
};
