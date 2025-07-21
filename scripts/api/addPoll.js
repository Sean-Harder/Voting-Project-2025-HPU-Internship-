export async function addPoll(data) {
    try {
        const response = await fetch("/api/addPoll", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to add poll");
        }

        return result;
    } catch (error) {
        console.error("Error in addPoll:", error);
        throw error;
    }
}
