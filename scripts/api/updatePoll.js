// scripts/api/updatePoll.js
export async function updatePoll(id, data) {
  // Send the PUT request
  const res = await fetch(`/api/poll/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let msg = `Error updating poll (status ${res.status})`;
    try {
      const body = await res.json();
      if (body.message) msg = body.message;
    } catch {/* ignore */}
    throw new Error(msg);
  }

  await res.json();

  // Clear the form
  if (typeof window.clearPoll === "function") {
    window.clearPoll();
    const submitBtn = document.querySelector("#createPoll .btn-primary");
    if (submitBtn) submitBtn.textContent = "Submit";
  }

  // Reload the page so the list updates
  window.location.reload();
}
