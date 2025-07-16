import { checkViewPoll } from '../../scripts/api/checkViewPoll.js';

const input = document.getElementById('pollIdInput');
const searchButton = document.getElementById('searchIdButton');
const clearButton = document.getElementById('clearButton');
const pollNotFoundDiv = document.getElementById('pollnotfound');
const pollSearchContainer = document.getElementById('searchpoll');

searchButton.addEventListener('click', async () => {
  const pollId = input.value.trim();

  // Hide "poll not found" and show search container initially
  pollNotFoundDiv.style.display = 'none';
  pollSearchContainer.style.display = 'flex';

  if (!pollId) {
    alert('Please enter a Poll ID.');
    return;
  }

  try {
    const pollData = await checkViewPoll(pollId);

    if (!pollData) {
      pollNotFoundDiv.style.display = 'flex';   // Show "not found"
      pollSearchContainer.style.display = 'none'; // Hide search UI
      return;
    }

    // Poll found - hide "not found" and show search UI
    pollNotFoundDiv.style.display = 'none';
    pollSearchContainer.style.display = 'flex';

    console.log('Poll found:', pollData);
    // TODO: render your poll data here

  } catch (error) {
    console.error(error);
    alert('An error occurred while searching for the poll.');
  }
});

clearButton.addEventListener('click', () => {
  input.value = '';
  pollNotFoundDiv.style.display = 'none';     // Hide "not found"
  pollSearchContainer.style.display = 'flex'; // Show search UI
});
