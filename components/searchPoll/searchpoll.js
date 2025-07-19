import { checkViewPoll } from '../../scripts/api/checkViewPoll.js';
import { showPollNotFound } from '../pollnotfound/pollnotfound.js';

const input = document.getElementById('pollIdInput');
const searchButton = document.getElementById('searchIdButton');
const clearButton = document.getElementById('clearButton');
const pollSearchContainer = document.getElementById('searchpoll');
const pollDisplayContainer = document.getElementById('votingpoll');
const submitButton = document.getElementById('submitPollButton');

const STORAGE_KEY = 'PulledPolls'; // localStorage key for cached polls

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
  return polls.find(p => p._id === id); // use _id as key
}

// Click handler for search
searchButton.addEventListener('click', async () => {
  const pollId = input.value.trim();

  showPollSearchUI();

  if (!pollId) {
    alert('Please enter a Poll ID.');
    return;
  }

  try {
    // 1. Check localStorage first
    const cachedPoll = findCachedPollById(pollId);
    if (cachedPoll) {
      renderPoll(cachedPoll);
      pollSearchContainer.style.display = 'none';
      pollDisplayContainer.style.display = 'flex';
      showToast('Loaded from local cache.', 'success');
      return;
    }

    // 2. Fetch from DB
    const pollData = await checkViewPoll(pollId);
    if (!pollData) {
      showPollNotFound(pollId);
      pollSearchContainer.style.display = 'none';
      pollDisplayContainer.style.display = 'none';
      return;
    }

    // 3. Save to localStorage
    const polls = getCachedPolls();
    polls.push(pollData);
    saveCachedPolls(polls);

    // 4. Render and show UI
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
});

// UI reset helper
function showPollSearchUI() {
  const pollNotFoundDiv = document.getElementById('pollnotfound');
  if (pollNotFoundDiv) pollNotFoundDiv.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
}

// Render poll layout
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

  // Disable submit initially
  if (submitButton) submitButton.disabled = true;

  // Add listener to enable on selection
  attachRadioChangeListener();
}

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

function showToast(message, type = 'primary') {
  // Remove any existing toast
  const existing = document.getElementById('pollToast');
  if (existing) existing.remove();

  const container = document.getElementById('toastContainer');
  if (!container) {
    console.warn('Missing #toastContainer in DOM');
    return;
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'pollToast';
  toast.className = `toast text-center text-white bg-${type} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  // Minimal style to wrap text
  toast.style.display = 'inline-block';
  toast.style.padding = '0.5rem 1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 0.25rem 0.5rem rgba(0,0,0,0.2)';
  toast.style.whiteSpace = 'nowrap';

  toast.textContent = message;

  container.appendChild(toast);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
