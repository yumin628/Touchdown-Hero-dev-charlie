$(document).ready(function() {
    let currentPlayer = "";
    let score = 0;
    let quarter = 1;
    let quarterStartTime = 0; // Variable to track round duration

    // 1. User Name Entry & Greeting
    $('#start-btn').on('click', function() {
        let inputName = $('#username-input').val().trim();
        currentPlayer = inputName === "" ? "Rookie_" + Math.floor(Math.random() * 1000) : inputName;
        
        $('#greeting').text(`Quarter ${quarter} - Go, ${currentPlayer}!`);
        $('#username-input').val('');
        
        quarterStartTime = Date.now(); // Record start time for speed bonus
    });

    // 2. Dynamic Defender Spawning
    function spawnDefenders() {
        $('.defender').remove(); // Clear existing defenders
        
        let numDefenders = quarter + 2; // Q1: 3, Q2: 4, Q3: 5, Q4: 6 defenders
        let availableWidth = 60; // Safe zone for spawning (15% ~ 75%)
        let spacing = availableWidth / (numDefenders - 1); 

        for(let i = 0; i < numDefenders; i++) {
            let leftPos = (15 + (spacing * i)) + '%'; 
            let randomStartTop = Math.floor(Math.random() * 300) + 'px'; // Assign random starting height
            
            let def = $(`<div class="defender bg-danger text-white text-center rounded" style="top: ${randomStartTop}; left: ${leftPos};">Def</div>`);
            $('.game-board').append(def);
            
            moveRandomly(def); // Assign random movement to each defender
        }
    }

    // 3. Random Defender Animation Logic
    function moveRandomly(defender) {
        let boardHeight = $('.game-board').height();
        let defHeight = defender.height();
        let maxTop = boardHeight - defHeight;

        let randomDestination = Math.floor(Math.random() * maxTop); // Set destination randomly
        
        // Base speed (difficulty) increases as quarter goes up
        let minSpeed = Math.max(200, 800 - (quarter * 150));
        let maxSpeed = Math.max(600, 1800 - (quarter * 250));
        let randomDuration = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed; // Irregular tempo

        defender.animate({ top: randomDestination }, randomDuration, 'swing', function() {
            // When animation ends, call itself again for infinite random movement
            moveRandomly(defender);
        });
    }

    // Initialize first set of defenders
    spawnDefenders();

    // 4. Collision Detection Logic
    function checkCollision(player, defender) {
        let p = player[0].getBoundingClientRect();
        let d = defender[0].getBoundingClientRect();
        return !(p.right < d.left || p.left > d.right || p.bottom < d.top || p.top > d.bottom);
    }

    // 5. Draggable & Collision Event
    $('#player').draggable({
        containment: ".game-board",
        revert: "invalid",
        drag: function(event, ui) {
            $('.defender').each(function() {
                if (checkCollision($('#player'), $(this))) {                     // 1. Force stop drag and reset position (Timer keeps running -> Bonus decreases)$('#player').trigger('mouseup').css({ top: '175px', left: '20px' });
                    
                    // 2. Direct point deduction penalty (-3 points)
                    score -= 3;
                    if (score < 0) score = 0; // Prevent score from dropping below 0

                    // 3. Show alert
                    alert(`💥 Tackled! You lost 3 points. (Current Score: ${score} pts)`);
                }
            });
        }
    });

    // 6. Droppable Endzone (Dynamic Scoring Logic)
    $('#endzone').droppable({
        accept: "#player",
        drop: function(event, ui) {
            if (!currentPlayer) {
                alert("Please enter your name or click 'Join Game' first!");
                ui.draggable.animate({ top: '175px', left: '20px' }, 200);
                return;
            }

            // Calculate speed bonus (seconds taken to breakthrough)
            let timeTaken = (Date.now() - quarterStartTime) / 1000;
            // Grant bonus if completed under 20 seconds (Faster = Higher score)
            let speedBonus = Math.max(0, Math.floor(20 - timeTaken)); 
            // Apply bonus multiplier based on quarter difficulty
            let roundScore = 7 + (speedBonus * quarter); 
            
            score += roundScore; // Add to total score
            saveScore(currentPlayer, score);
            
            if (quarter === 4) {
                alert(`🏆 SUPER BOWL CHAMPION!\nTime: ${timeTaken.toFixed(1)}s\nRound Score: ${roundScore} pts\n\nFinal Total Score: ${score} pts!`);
                quarter = 1; 
                score = 0; 
            } else {
                alert(`🏈 TOUCHDOWN!\nTime: ${timeTaken.toFixed(1)}s\nRound Score: ${roundScore} pts\nAdvancing to Quarter ${quarter + 1}...`);
                quarter++; 
            }

            $('#greeting').text(`Quarter ${quarter} - Go, ${currentPlayer}!`);
            $('#player').css({ top: '175px', left: '20px' });
            
            $('.defender').stop(true, false); 
            spawnDefenders(); 
            quarterStartTime = Date.now(); // Reset timer for next quarter
            
            new bootstrap.Modal(document.getElementById('leaderboardModal')).show();
            updateLeaderboard();
        }
    });

    // 7. Reset Button Logic
    $('#reset-btn').on('click', function() { 
        $('#player').animate({ top: '175px', left: '20px' }, 300); 
    });

    // 8. Session Storage & Leaderboard Functions
    function saveScore(name, newScore) {
        let leaderboard = JSON.parse(sessionStorage.getItem('touchdownScores')) || [];
        leaderboard.push({ user: name, points: newScore, time: new Date().toLocaleTimeString() });
        sessionStorage.setItem('touchdownScores', JSON.stringify(leaderboard));
    }

    function updateLeaderboard() {
        let leaderboard = JSON.parse(sessionStorage.getItem('touchdownScores')) || [];
        let listHtml = "";
        
        // Sort by highest points
        leaderboard.sort((a, b) => b.points - a.points);
        
        leaderboard.forEach(entry => {
            listHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">${entry.user} <span class="badge bg-primary rounded-pill">${entry.points} pts</span></li>`;
        });
        $('#score-list').html(listHtml);
    }

    // 9. Clear Leaderboard Logic
    $('#clear-leaderboard-btn').on('click', function() {
        // Ask for confirmation to prevent accidental clicks
        if (confirm("Are you sure you want to clear all scores?")) {
            sessionStorage.removeItem('touchdownScores'); // Completely remove data from storage
            updateLeaderboard(); // Update leaderboard to show empty screen
            alert("Leaderboard has been cleared.");
        }
    });
});