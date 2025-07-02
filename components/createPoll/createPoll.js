function submitPoll() {
    const question = document.getElementById("pollQuestion").value;
    const desc = document.getElementById("pollDescription").value;
    const opt1 = document.getElementById("option1").value;
    const opt2 = document.getElementById("option2").value;
    alert("Poll Submitted!\n\nQuestion: " + question + "\nDescription: " +  
    desc +"\nOptions: " + opt1 + ", " + opt2);
}

function clearPoll() {
    document.getElementById("pollQuestion").value = "";
    document.getElementById("pollDescription").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
}

function showCreatePoll() {
    document.getElementById("createPoll").scrollIntoView();
}