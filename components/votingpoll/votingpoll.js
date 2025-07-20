import { submitVote } from '../../scripts/api/submitvote.js';

// --- DOM References ---
const votingPollContainer = document.getElementById('votingpoll');
const pollSearchContainer = document.getElementById('searchpoll');
const cancelBtn = document.getElementById('cancelPollBtn');
const submitBtn = document.getElementById('submitPollBtn');

// --- Check Local Vote ---
const pollId = votingPollContainer?.dataset.pollId;
if (pollId && localStorage.getItem(`voted_${pollId}`)) {
  votingPollContainer.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
  showToast('You have already voted on this poll.', 'info');
}

// --- Cancel Button Handler ---
function cancelPoll() {
  votingPollContainer.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
}

// Attach cancel handler
if (cancelBtn) {
  cancelBtn.addEventListener('click', cancelPoll);
}

// --- Enable Submit Button When Option Is Selected ---
if (submitBtn) {
  submitBtn.disabled = true; // Initially disabled

  document.querySelectorAll('input[name="mode"]').forEach(input => {
    input.addEventListener('change', () => {
      submitBtn.disabled = false;
    });
  });

  // Attach submit handler
  // submitBtn.addEventListener('click', submitPoll);
}

// --- Submit Poll Vote ---
// function submitPoll() {
//   console.log('submitPoll fired');

//   const selected = document.querySelector('input[name="mode"]:checked');
//   if (!selected) {
//     showToast('Please select an option before submitting.', 'danger');
//     return;
//   }

//   const option = selected.value;

//   if (!pollId) {
//     showToast('Poll ID is missing from the container.', 'danger');
//     return;
//   }

//   submitBtn.disabled = true;
//   submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

//   submitVote(pollId, option)
//     .then(response => {
//       console.log('Vote submit response:', response);

//       if (response && response.message === 'Vote submitted successfully') {
//         // Save local vote so user can't vote again
//         localStorage.setItem(`voted_${pollId}`, option);

//         showToast('Vote submitted successfully!', 'success');
//         cancelPoll();
//         return;
//       } else {
//         showToast('Unexpected response from server.', 'warning');
//       }
//     })
//     .catch(err => {
//       console.error('Submit error:', err);
//       showToast('Failed to submit vote.', 'danger');
//     })
//     .finally(() => {
//       submitBtn.disabled = false;
//       submitBtn.textContent = 'Submit';
//     });
// }

// --- Toast Utility ---
function showToast(message, type = 'primary') {
  const existing = document.getElementById('pollToast');
  if (existing) existing.remove();

  const container = document.getElementById('toastContainer');
  if (!container) {
    console.warn('Missing #toastContainer in DOM');
    return;
  }

  const toast = document.createElement('div');
  toast.id = 'pollToast';
  toast.className = `toast text-center text-white bg-${type} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.style.display = 'inline-block';
  toast.style.padding = '0.5rem 1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 0.25rem 0.5rem rgba(0,0,0,0.2)';
  toast.style.whiteSpace = 'nowrap';

  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
