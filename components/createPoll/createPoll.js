import { editPoll } from "../../scripts/api/editPoll.js";

document
  .getElementById("submitPollIdButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    submitUpdatePoll();
  });

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
