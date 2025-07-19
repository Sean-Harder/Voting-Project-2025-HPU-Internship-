import { submitVote } from '../../scripts/api/submitvote.js';

// References to containers
const votingPollContainer = document.getElementById('votingpoll');
const pollSearchContainer = document.getElementById('searchpoll');

// Cancel button handler
function cancelPoll() {
  votingPollContainer.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
}

// Attach cancel handler
const cancelBtn = document.getElementById('cancelPollBtn');
if (cancelBtn) {
  cancelBtn.addEventListener('click', cancelPoll);
}

// Submit button handler
const submitBtn = document.getElementById('submitPollBtn');
if (submitBtn) {
  submitBtn.disabled = true; // Initially disabled

  // Enable submit only when option selected
  document.querySelectorAll('input[name="mode"]').forEach(input => {
    input.addEventListener('change', () => {
      submitBtn.disabled = false;
    });
  });

  submitBtn.addEventListener('click', submitPoll);
}

function submitPoll() {
  console.log('submitPoll fired');
  const selected = document.querySelector('input[name="mode"]:checked');
  if (!selected) {
    showToast('Please select an option before submitting.', 'danger');
    return;
  }

  const pollId = votingPollContainer.dataset.pollId;
  const option = selected.value;

  console.log('Submitting vote:', { pollId, option });

  if (!pollId) {
    showToast('Poll ID is missing from the container.', 'danger');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  submitVote(pollId, option)
    .then(response => {
      showToast('Vote submitted successfully!', 'success');

      console.log('Vote submit response:', response);
      if (response && response.message === 'Vote submitted successfully') {
        showToast('Vote submitted successfully!', 'success');
        cancelPoll();
      } else {
        showToast('Unexpected response from server.', 'warning');
      }
    })
    .catch(err => {
      console.error('Submit error:', err);
      showToast('Failed to submit vote.', 'danger');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    });
}

// Toast utility
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
