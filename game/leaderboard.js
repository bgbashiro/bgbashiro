
function updateLeaderBoard(level) {
    let leaderboardOL = document.querySelector("#leaderboard > ol")
    leaderboardOL.innerHTML = "";
    fetchLeaderBoard(level).then(rows => {
        Object.entries(rows).forEach(([uuid, score]) => {
            getUsername(uuid).then(row => {
                let li = document.createElement("li")
                li.innerText = `${row} : ${score}`
                li.classList.add('leaderbord-entry');
                leaderboardOL.appendChild(li);
            })
        })
    })
}
