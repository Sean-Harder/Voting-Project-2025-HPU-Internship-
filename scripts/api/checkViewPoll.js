export async function checkViewPoll(pollID) {
  try {
    const response = await fetch(`http://localhost:3000/api/checkViewPoll/${pollID}`, {
      method: 'GET',
    });

    if (!response.ok) {
      // Attempt to parse error message from JSON, else fallback to status text
      let errorMsg;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || response.statusText;
      } catch {
        errorMsg = response.statusText;
      }
      throw new Error(`API error: ${errorMsg} (status ${response.status})`);
    }

    const data = await response.json();

    console.log('checkViewPoll:', data);
    return data;

  } catch (error) {
    console.error('checkViewPoll, api fail:', error);
    return null; // Return null on failure so caller can handle
  }
}
