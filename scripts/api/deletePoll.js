export async function deletePoll(pollID) {
    try {
        const response = await fetch(`http://localhost:3000/api/poll/${pollID}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        console.log('deletePolldata:', data)
    }
    catch (error) {
        console.error('delete poll, api fail:', error)

    }
}