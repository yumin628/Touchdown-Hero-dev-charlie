# Lions Touchdown Hero 🏈
> Dodge the defenders and reach the Red Zone to claim your Super Bowl victory!

## authorship
- **Yumin Choi** | [yumin-choi](https://github.com/yumin628)
- October 6, 2026
- Version 1.0.0

## user story 
- **as an** international student who recently got into American football,
- **i want** to play a fast-paced drag-and-drop dodging game,
- **so that** I can experience the thrill of scoring a touchdown and climbing the leaderboard.

## narrative
Step onto the gridiron as the ultimate Touchdown Hero! Navigate through waves of relentless, randomly moving defenders to reach the Red Zone. Watch the play clock—the faster you score, the higher your bonus points. But beware: every tackle costs you 3 points and precious time! Can you survive all 4 quarters and lift the Super Bowl trophy?

## about the app

### wireframe & game ideas
- [wiki/wireframe](https://github.com/yumin628/dev-charlie/wiki)
- [issue/game idea](https://github.com/yumin628/dev-charlie/issues/1)

### project directory structure
```text
C:.
├───assets
│   ├───css
│   │   └───style.css
│   └───js
│       ├───concept.js
│       └───full.js
├───index.html
└───full.html
```

### tech stack
- **Editor:** VS Code (Live Server)
- **Frontend Core:** HTML5 (Emmet), CSS3, JavaScript
- **Frameworks & Libraries:** Bootstrap 5 (UI & Modals), Bootstrap Icons, jQuery, jQuery UI (Draggable/Droppable)
- **Version Control & Hosting:** Git, GitHub (Repo, Issues, Wiki, GitHub Pages)

### code snippet
- This snippet demonstrates how the game constantly checks for overlapping coordinates between the dragged player and the defenders. If a tackle occurs, the drag stops, the player loses 3 points directly, and is sent back to the starting line.

```javascript
$('#player').draggable({
    containment: ".game-board",
    revert: "invalid",
    drag: function(event, ui) {
        $('.defender').each(function() {
            if (checkCollision($('#player'), $(this))) {
                // Force stop drag and reset position
                $('#player').trigger('mouseup').css({ top: '175px', left: '20px' });
                
                // Direct point deduction penalty (-3 points)
                score -= 3;
                if (score < 0) score = 0; // Prevent negative scores

                alert(`💥 Tackled! You lost 3 points. (Current Score: ${score} pts)`);
            }
        });
    }
});
```

### validation & accessibility
- **HTML Validation:** Checked via [W3C Nu HTML Checker](https://validator.w3.org/nu/). No errors or warnings found.
- **Lighthouse Score:** Tested via Chrome DevTools. 100% Accessibility and Best Practices achieved.

### future ideas
> check out Sprint 99 for future app ideas
- [milestone/sprint 99](https://github.com/yumin628/dev-charlie/milestone/1)
