export function showPollNotFound(pollId) {
  const pollNotFoundDiv = document.getElementById('pollnotfound');
  const notFoundPollId = document.getElementById('notFoundPollId');
  const closeButton = document.getElementById('closeButton');
  const pollSearchContainer = document.getElementById('searchpoll');
  const input = document.getElementById('pollIdInput');
  const searchButton = document.getElementById('searchIdButton');

  if (notFoundPollId) {
    notFoundPollId.textContent = `"${pollId}"`;
  }

  if (pollNotFoundDiv) pollNotFoundDiv.style.display = 'flex';
  if (pollSearchContainer) pollSearchContainer.style.display = 'none';

  if (closeButton) {
    closeButton.onclick = () => {
      // Hide not found panel
      pollNotFoundDiv.style.display = 'none';
      pollSearchContainer.style.display = 'flex';

      // Disable search button
      searchButton.disabled = true;

      // Optional: clear input, or keep as is — I keep it as is here
      // input.value = '';

      // Add input event listener to enable button again on change
      const onInputChange = () => {
        searchButton.disabled = input.value.trim() === '';
        // Remove this listener after enabling button once
        if (!searchButton.disabled) {
          input.removeEventListener('input', onInputChange);
        }
      };

      input.addEventListener('input', onInputChange);
    };
  }
}
