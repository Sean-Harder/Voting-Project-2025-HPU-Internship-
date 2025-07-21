// components/createPoll/createpoll.js

window.submitPoll = async function () {
    const question = document.getElementById("pollQuestion").value.trim();
    const desc = document.getElementById("pollDescription").value.trim();
    const opt1 = document.getElementById("option1").value.trim();
    const opt2 = document.getElementById("option2").value.trim();

    if (!question || !desc || !opt1 || !opt2) {
        alert("Please fill in all fields.");
        return;
    }

    const payload = {
        name: question,
        poll_desc: desc,
        poll_response_options: [opt1, opt2],
    };

    try {
        const response = await fetch("/api/addPoll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Poll submitted successfully!");
            window.clearPoll();
        } else {
            alert("❌ Failed to submit poll: " + result.message);
        }
    } catch (err) {
        alert("❌ Error: " + err.message);
    }
};

window.clearPoll = function () {
    document.getElementById("pollQuestion").value = "";
    document.getElementById("pollDescription").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
};
