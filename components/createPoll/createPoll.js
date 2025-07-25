import { addPoll } from "../../scripts/api/addPoll.js";
import { editPoll } from "../../scripts/api/editPoll.js";

document
  .getElementById("submitPollIdButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (window.currentEditingPollId) {
      submitUpdatePoll(); // Edit existing
    } else {
      submitNewPoll(); // Create new
    }
  });

let device_id = localStorage.getItem("device_id");
if (!device_id) {
  device_id = crypto.randomUUID();
  localStorage.setItem("device_id", device_id);
}


async function submitNewPoll() {
  const question = document.getElementById("pollQuestion").value.trim();
  const desc = document.getElementById("pollDescription").value.trim();
  const optionsRaw = document.getElementById("pollOptions").value.trim();

  const poll_options = optionsRaw
    .split(",")
    .map((opt) => opt.trim())
    .filter((opt) => opt.length > 0);


  const device_id = localStorage.getItem("device_id");

  if (!device_id) {
    alert("Device ID is missing. Please reload the page.");
    return;
  }

  if (!question || poll_options.length < 2) {
    alert("Please provide a question and at least 2 options.");
    return;
  }

  const data = {
    poll_question: question,
    poll_description: desc,
    poll_options,
    device_id,
  };

  try {
    const result = await addPoll(data);
    if (result?.poll) {
      alert("✅ Poll created!");
      if (typeof window.addPollToUI === "function") {
        window.addPollToUI(result.poll);
      }
      clearPoll();
    }
  } catch (error) {
    console.error("Error creating poll:", error);
    alert("Failed to create poll: " + error.message);
  }
}


async function submitUpdatePoll() {
  const question = document.getElementById("pollQuestion").value.trim();
  const desc = document.getElementById("pollDescription").value.trim();
  const optionsRaw = document.getElementById("pollOptions").value.trim();
  const id = window.currentEditingPollId;

  if (!id) {
    console.error("No poll selected for update.");
    return;
  }

  const poll_options = optionsRaw
    .split(",")
    .map((opt) => opt.trim())
    .filter((opt) => opt.length > 0);

  const data = {
    poll_question: question,
    poll_description: desc,
    poll_options,
  };

  try {
    const result = await editPoll(id, data);
    if (result?.poll) {
      if (typeof window.updatePollInUI === "function") {
        window.updatePollInUI(result.poll);
      }
      clearPoll();
    }
  } catch (error) {
    console.error("Error updating poll:", error);
    alert("Failed to update poll: " + error.message);
  }
}

function clearPoll() {
  document.getElementById("pollQuestion").value = "";
  document.getElementById("pollDescription").value = "";
  document.getElementById("pollOptions").value = "";
  window.currentEditingPollId = null;

  const submitBtn = document.querySelector("#createPoll .btn-primary");
  if (submitBtn) submitBtn.textContent = "Submit";
}

window.clearPoll = clearPoll;
