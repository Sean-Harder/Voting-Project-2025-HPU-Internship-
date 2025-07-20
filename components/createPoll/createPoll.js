// components/createPoll/createPoll.js
import  {updatePoll}  from "../../scripts/api/updatepoll.js"

document.getElementById("pollQuestion").addEventListener("click", function(event){
  event.preventDefault();
  event.stopPropagation();
  submitUpdatePoll();  
} );

async function submitUpdatePoll() {
  const question = document.getElementById("pollQuestion").value.trim();
  const desc     = document.getElementById("pollDescription").value.trim();
  const opt1     = document.getElementById("option1").value.trim();
  const opt2     = document.getElementById("option2").value.trim();
  
  const id = window.currentEditingPollId;

  const data = {
    poll_question: question,
    poll_description: desc,
    options: [{ text: opt1 }, { text: opt2 }]
  };
console.log("test fire")
  updatePoll(id,data)


}


async function submitPoll() {
  const question = document.getElementById("pollQuestion").value.trim();
  const desc     = document.getElementById("pollDescription").value.trim();
  const opt1     = document.getElementById("option1").value.trim();
  const opt2     = document.getElementById("option2").value.trim();

  const data = {
    poll_question: question,
    poll_description: desc,
    options: [{ text: opt1 }, { text: opt2 }]
  };

  // Determine create vs update
  const id = window.currentEditingPollId;
  console.log("test id: ", id)
  const url = id ? `/api/poll/${id}` : `/api/poll`;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(bodyText || `Request failed (${res.status})`);
    }

    // On success, clear form and refresh the My Polls list
    clearPoll();
    const hasBtn = document.getElementById("test-has-polls");
    if (hasBtn) hasBtn.click();
  } catch (err) {
    const action = id ? "update" : "submit";
    alert(`Failed to ${action} poll: ${err.message}`);
  }
}

function clearPoll() {
  document.getElementById("pollQuestion").value    = "";
  document.getElementById("pollDescription").value = "";
  document.getElementById("option1").value         = "";
  document.getElementById("option2").value         = "";
  window.currentEditingPollId = null;
  const submitBtn = document.querySelector("#createPoll .btn-primary");
  if (submitBtn) submitBtn.textContent = "Submit";
}

// Expose globally for component wiring
//window.submitPoll = submitUpdatePoll;
window.clearPoll  = clearPoll;
