# Voting-Project-2025-HPU-Internship-

Project #1 for High Point Universities Anonymous Voting Project
--------------------
A basic, anonymous voting application where anyone can create and share a poll 
for others to vote on. Simple, intuitive, and lightweight—built for quick feedback 
with minimal friction.

===============================
 Voting Project Setup Guide
===============================

1. Extract the archive:
  - Double-click the `Voting-Project-2025-HPU-Internship-.tar.gz` file
  OR
  - Run in terminal: 
    tar -xvf Voting-Project-2025-HPU-Internship-.tar.gz

2. Go into the extracted folder:
  cd Voting-Project-2025-HPU-Internship-

3. Run the setup script:
  ./setup.sh

This script will:
- Check that Node.js and npm are installed
- Install all necessary dependencies (via `npm install`)
- Start the development server using `npm run dev`

➡️ After the server starts, open the browser and go to the provided `localhost` link.

If you don't have Node.js installed, you can download it from:
https://nodejs.org/

====================
Features
====================

- Users can create polls by entering:
  • A question
  • A description
  • Up to 6 multiple-choice responses

- Once a poll is created, a unique Poll ID is generated and returned.

- Poll creators can share the Poll ID via Discord, group chats, announcements, etc.

- Participants can vote anonymously by:
  • Pasting the Poll ID into the "Vote on Poll" tab
  • Viewing the poll and selecting one response
  • Submitting their vote (one vote per session/user)

- Light and Dark Mode UI options

- Short answer polls are NOT saved (only multiple-choice are supported)

====================
Tech Stack
====================

Frontend:
- HTML
- CSS
- JavaScript
- Figma (used for frontend design mockups)

Backend:
- MongoDB (used for storing poll data such as questions, options, votes)

Tools:
- GitHub (version control and code repository)
- Sourcetree (used for Git branching and collaborative development)


====================
Core Functions
====================

addPoll
- Takes input for poll creation (question, description, up to 6 options)
- Saves the poll to the MongoDB database
- Returns a unique pollId

viewPoll(pollId)
- Searches the database for the poll with the given pollId
- If found, returns the poll with its question and options
- If not found, returns: "Poll not found with ID: [pollId]"

submitVote
- Records a user's selected option for the poll
- Updates the vote count in the database

deletePoll(pollId)

editPoll(pollId)

====================
Usage Example
====================

1. Create a poll:
   - Fill in the poll form with your question, description, and up to 6 answers.

2. Share the returned Poll ID.

3. Others visit the app, paste the Poll ID, and vote.

4. Poll results can be displayed or tracked separately 
   (depending on future enhancements).

====================
Notes
====================

- Voting is anonymous.
- Polls with short answers are not stored or supported.
- No authentication system (open access).