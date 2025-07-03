export async function getMyPolls(device_id) {
    try {
        const response = await fetch(`http://localhost:3000/api/poll/device/${device_id}`, {
            method: 'GET',
        });
        
        const data = await response.json();
        const polls = data.data // Handles null polls so if non this will just be null
        
        if (polls) {
            console.log('You have polls: ', polls)
        } else {
            console.log('You have not created any polls: ', polls) // which is why we can still pass it here
        }
        return polls
    }
    catch (error) {
        console.error('getMyPolls, api fail:', error)
    }
}