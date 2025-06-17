export async function editPoll(pollID, updates) {
  try {
    const response = await fetch(`http://localhost:3000/api/poll/${pollID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    console.log('editPoll response:', data);
    return data;
  } catch (error) {
    console.error('Failed to update poll:', error);
    throw error;
  }
}
