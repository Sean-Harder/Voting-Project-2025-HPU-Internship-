export async function addPoll(poll_desc, poll_response_options) {
    try {
        const response = await fetch('http://localhost:3000/api/polls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poll_desc, poll_response_options }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add poll');
        }

        return await response.json();
    } catch (err) {
        console.error('Add Poll Error:', err.message);
        throw err;
    }
}
