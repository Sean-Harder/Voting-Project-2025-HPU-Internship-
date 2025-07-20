import { checkViewPoll } from '../../scripts/api/checkViewPoll.js';
import { showPollNotFound } from '../pollnotfound/pollnotfound.js';
import { submitVote } from '../../scripts/api/submitvote.js'; // Assuming you have this import

const input = document.getElementById('pollIdInput');
const searchButton = document.getElementById('searchIdButton');
const clearButton = document.getElementById('clearButton');
const pollSearchContainer = document.getElementById('searchpoll');
const pollDisplayContainer = document.getElementById('votingpoll');
const submitButton = document.getElementById('submitPollBtn'); 

const STORAGE_KEY = 'PulledPolls'; // localStorage key for cached polls

let activePollId = null; // <-- Store active poll ID here

// Disable the search button by default
searchButton.disabled = true;

// Enable/disable search button based on input
input.addEventListener('input', () => {
  searchButton.disabled = input.value.trim() === '';
});

// LocalStorage helpers
function getCachedPolls() {
  const cached = localStorage.getItem(STORAGE_KEY);
  return cached ? JSON.parse(cached) : [];
}

function saveCachedPolls(polls) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
}

function findCachedPollById(id) {
  const polls = getCachedPolls();
  return polls.find(p => p._id === id);
}

// Search button click handler
searchButton.addEventListener('click', async () => {
  const pollId = input.value.trim();

  showPollSearchUI();

  if (!pollId) {
    alert('Please enter a Poll ID.');
    return;
  }

  try {
    // Check local cache first
    const cachedPoll = findCachedPollById(pollId);
    if (cachedPoll) {
      renderPoll(cachedPoll);
      pollSearchContainer.style.display = 'none';
      pollDisplayContainer.style.display = 'flex';
      showToast('Loaded from local cache.', 'success');
      return;
    }

    // Fetch from API
    const pollData = await checkViewPoll(pollId);
    if (!pollData) {
      showPollNotFound(pollId);
      pollSearchContainer.style.display = 'none';
      pollDisplayContainer.style.display = 'none';
      return;
    }

    // Save to cache
    pollData._id = pollData._id || pollId; // fallback if needed
    const polls = getCachedPolls();
    polls.push(pollData);
    saveCachedPolls(polls);

    // Render poll UI
    renderPoll(pollData);
    pollSearchContainer.style.display = 'none';
    pollDisplayContainer.style.display = 'flex';
    showToast('Fetched from database.', 'info');

  } catch (error) {
    console.error(error);
    alert('An error occurred while searching for the poll.');
  }
});

// Clear button
clearButton.addEventListener('click', () => {
  input.value = '';
  searchButton.disabled = true;
  showPollSearchUI();
  pollDisplayContainer.style.display = 'none';
  if (submitButton) submitButton.disabled = true;
  activePollId = null; // Clear active poll id on clear
});

// UI reset helper
function showPollSearchUI() {
  const pollNotFoundDiv = document.getElementById('pollnotfound');
  if (pollNotFoundDiv) pollNotFoundDiv.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
}

// Render poll layout and store active poll ID
function renderPoll(pollData) {
  const questionEl = document.getElementById('pollQuestion');
  const descriptionEl = document.getElementById('pollDescription');
  const responseOptions = document.querySelector('.response-options');

  if (!questionEl || !descriptionEl || !responseOptions) {
    console.warn('Missing DOM elements');
    return;
  }

  questionEl.textContent = pollData.poll_question || 'No question';
  descriptionEl.textContent = pollData.poll_description || 'No description';
  responseOptions.innerHTML = '';

  responseOptions.style.display = 'flex';
  responseOptions.style.flexDirection = 'column';
  responseOptions.style.gap = '0.5rem';

  const options = pollData.poll_options || [];

  for (let i = 0; i < options.length; i += 2) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.justifyContent = 'space-around';
    rowDiv.style.gap = '2rem';

    const label1 = document.createElement('label');
    label1.classList.add('py-1');
    label1.innerHTML = `<input type="radio" name="mode" value="${options[i]}"> ${options[i]}`;
    rowDiv.appendChild(label1);

    if (i + 1 < options.length) {
      const label2 = document.createElement('label');
      label2.classList.add('py-1');
      label2.innerHTML = `<input type="radio" name="mode" value="${options[i + 1]}"> ${options[i + 1]}`;
      rowDiv.appendChild(label2);
    }

    responseOptions.appendChild(rowDiv);
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  activePollId = pollData._id || null; // <-- Save the active poll ID here

  attachRadioChangeListener(); // Attach listener after rendering options
}

// Attach listener to enable submit button
function attachRadioChangeListener() {
  const radios = document.querySelectorAll('input[name="mode"]');
  if (!submitButton) return;

  submitButton.disabled = true;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      submitButton.disabled = false;
    });
  });
}

// Submit button handler
if (submitButton) {
  submitButton.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="mode"]:checked');
    if (!selectedOption) {
      showToast('Please select an option before submitting.', 'danger');
      return;
    }

    if (!activePollId) {
      showToast('Poll ID is missing. Please try again.', 'danger');
      return;
    }

    const option = selectedOption.value;

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    submitVote(activePollId, option)
      .then(response => {
        showToast('Vote submitted successfully!', 'success');
        // Optionally reset or hide poll here
      })
      .catch(err => {
        console.error('Error submitting vote:', err);
        showToast('Failed to submit vote.', 'danger');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      });
  });
}

// Toast message display helper
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

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
