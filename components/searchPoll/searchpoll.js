import { checkViewPoll } from '../../scripts/api/checkViewPoll.js';
import { submitVote } from '../../scripts/api/submitvote.js';
import { showPollNotFound } from '../pollnotfound/pollnotfound.js';

const input = document.getElementById('pollIdInput');
const searchButton = document.getElementById('searchIdButton');
const clearButton = document.getElementById('clearButton');
const pollSearchContainer = document.getElementById('searchpoll');
const pollDisplayContainer = document.getElementById('votingpoll');
const submitButton = document.getElementById('submitPollBtn'); 
const toastContainer = document.getElementById('toastContainer');

const POLL_CACHE_KEY = 'PulledPolls';
const VOTE_TRACK_KEY = 'VotedPolls';

let activePollId = null;

// --- LocalStorage Helpers ---
function getCachedPolls() {
  const cached = localStorage.getItem(POLL_CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

function saveCachedPolls(polls) {
  localStorage.setItem(POLL_CACHE_KEY, JSON.stringify(polls));
}

function findCachedPollById(id) {
  const polls = getCachedPolls();
  return polls.find(p => p._id === id);
}

function getVotedPolls() {
  const stored = localStorage.getItem(VOTE_TRACK_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveVotedPoll(pollId) {
  const current = getVotedPolls();
  if (!current.includes(pollId)) {
    current.push(pollId);
    localStorage.setItem(VOTE_TRACK_KEY, JSON.stringify(current));
  }
}

function hasUserVoted(pollId) {
  return getVotedPolls().includes(pollId);
}

// --- UI Control ---
function showPollSearchUI() {
  const pollNotFoundDiv = document.getElementById('pollnotfound');
  if (pollNotFoundDiv) pollNotFoundDiv.style.display = 'none';
  pollSearchContainer.style.display = 'flex';
}

function disablePollInteraction() {
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.disabled = true;
  });
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Already Voted';
  }
}

function attachRadioChangeListener() {
  const radios = document.querySelectorAll('input[name="mode"]');
  if (!submitButton) return;

  submitButton.disabled = true;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    });
  });
}

function showToast(message, type = 'primary') {
  const existing = document.getElementById('pollToast');
  if (existing) existing.remove();

  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.id = 'pollToast';
  toast.className = `toast text-center text-white bg-${type} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.style.padding = '0.5rem 1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 0.25rem 0.5rem rgba(0,0,0,0.2)';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// --- Render Poll ---
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

  activePollId = pollData._id;

  attachRadioChangeListener();

  if (hasUserVoted(activePollId)) {
    disablePollInteraction();
    showToast('You have already voted on this poll.', 'info');
  }
}

// --- Submit Vote ---
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

    if (hasUserVoted(activePollId)) {
      showToast('You have already voted on this poll.', 'info');
      disablePollInteraction();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    submitVote(activePollId, selectedOption.value)
      .then(() => {
        showToast('Vote submitted successfully!', 'success');
        saveVotedPoll(activePollId);
        disablePollInteraction();
      })
      .catch(err => {
        console.error('Error submitting vote:', err);
        showToast('Failed to submit vote.', 'danger');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      });
  });
}

// --- Search Button ---
input.addEventListener('input', () => {
  searchButton.disabled = input.value.trim() === '';
});

searchButton.addEventListener('click', async () => {
  const pollId = input.value.trim();
  if (!pollId) return;

  showPollSearchUI();

  try {
    let pollData = findCachedPollById(pollId);
    if (pollData) {
      showToast('Loaded from local cache.', 'success');
    } else {
      pollData = await checkViewPoll(pollId);
      if (!pollData) {
        showPollNotFound(pollId);
        pollSearchContainer.style.display = 'none';
        pollDisplayContainer.style.display = 'none';
        return;
      }
      const polls = getCachedPolls();
      pollData._id = pollData._id || pollId;
      polls.push(pollData);
      saveCachedPolls(polls);
      showToast('Fetched from database.', 'info');
    }

    renderPoll(pollData);
    pollSearchContainer.style.display = 'none';
    pollDisplayContainer.style.display = 'flex';
  } catch (error) {
    console.error(error);
    alert('An error occurred while searching for the poll.');
  }
});

// --- Clear Button ---
clearButton.addEventListener('click', () => {
  input.value = '';
  searchButton.disabled = true;
  showPollSearchUI();
  pollDisplayContainer.style.display = 'none';
  if (submitButton) submitButton.disabled = true;
  activePollId = null;
});
