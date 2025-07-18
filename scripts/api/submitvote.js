export async function submitVote(pollId, selectedOption) {
  try {
    const response = await fetch('http://localhost:3000/api/submitVote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId, selectedOption }),
    });

    console.log('submitVote response status:', response.status);

    const data = await response.json();
    console.log('submitVote parsed JSON:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit vote');
    }

    return data;
  } catch (error) {
    console.error('submit vote, api fail:', error);
    throw error;
  }
}
