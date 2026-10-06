$(document).ready(function() {
    let currentPlayer = "";
    let score = 0;

    // 1. User Name Entry & Greeting
    $('#start-btn').on('click', function() {
        let inputName = $('#username-input').val().trim();
        currentPlayer = inputName === "" ? "Guest_" + Math.floor(Math.random() * 1000) : inputName;
        $('#greeting').text(`Ready for kickoff, ${currentPlayer}!`);
        $('#username-input').val('');
    });

    // 2. Initialize Draggable Player
    $('#player').draggable({
        containment: ".game-board",
        revert: "invalid"
    });

    // 3. Initialize Droppable Endzone
    $('#endzone').droppable({
        accept: "#player",
        drop: function(event, ui) {
            if (!currentPlayer) {
                alert("Please enter your name or click 'Join Game' first!");
                ui.draggable.animate({ top: '175px', left: '20px' }, 200);
                return;
            }
            score += 7; // Touchdown points
            saveScore(currentPlayer, score);
            new bootstrap.Modal(document.getElementById('leaderboardModal')).show();
            updateLeaderboard();
        }
    });

    // 4. Reset Button Logic
    $('#reset-btn').on('click', function() {
        $('#player').animate({ top: '175px', left: '20px' }, 300);
    });

    // 5. Session Storage & Leaderboard Functions
    function saveScore(name, newScore) {
        let leaderboard = JSON.parse(sessionStorage.getItem('touchdownScores')) || [];
        leaderboard.push({ user: name, points: newScore, time: new Date().toLocaleTimeString() });
        sessionStorage.setItem('touchdownScores', JSON.stringify(leaderboard));
    }

    function updateLeaderboard() {
        let leaderboard = JSON.parse(sessionStorage.getItem('touchdownScores')) || [];
        let listHtml = "";
        leaderboard.reverse().forEach(entry => {
            listHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">${entry.user} <span class="badge bg-primary rounded-pill">${entry.points} pts</span></li>`;
        });
        $('#score-list').html(listHtml);
    }

    // 6. Clear Leaderboard Logic
    $('#clear-leaderboard-btn').on('click', function() {
        // Ask for confirmation to prevent accidental clicks
        if (confirm("Are you sure you want to clear all scores?")) {
            sessionStorage.removeItem('touchdownScores'); // Completely remove data from storage
            updateLeaderboard(); // Update leaderboard to show empty screen
            alert("Leaderboard has been cleared.");
        }
    });
});