export async function deletePoll(pollID) {
    try {
        const response = await fetch(`http://localhost:3000/api/poll/${pollID}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete poll');
        }

        return data; // success response
    } catch (error) {
        console.error('delete poll, api fail:', error);
        throw error; // rethrow so frontend can handle it
    }
}
