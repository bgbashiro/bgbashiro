
function updateLeaderBoard(level) {
    let leaderboardOL = document.querySelector("#leaderboard > ol")
    leaderboardOL.innerHTML = "";
    fetchLeaderBoard(level).then(rows => {
        Object.entries(rows).forEach(([uuid, score]) => {
            getUsername(uuid).then(row => {
                let li = document.createElement("li")
                li.innerText = `${row} : ${score}`
                li.classList.add('leaderboard-entry');
                if (window.uuid == uuid) {
                    li.classList.add('leaderboard-entry-own')
                }
                leaderboardOL.appendChild(li);
            })
        })
    })
}

function updateHallOfFame() {
    let halloffameOL = document.querySelector("#halloffame > ol")
    halloffameOL.innerHTML = "";
    fetchHOF().then(rows => {
        rows.forEach(row => {
            let uuid = row['uuid'];
            let message = row['message'];
            getUsername(uuid).then(row => {
                let li = document.createElement("li");
                li.classList.add('halloffame-entry');
                if (window.uuid == uuid) {
                    li.classList.add('halloffame-entry-own')
                }
                let p = document.createElement("p");
                p.innerText = message;
                let span = document.createElement("span");
                span.innerText = "- " + row;
                span.classList.add("halloffame-entry-username");
                li.appendChild(p);
                li.appendChild(span);
                halloffameOL.appendChild(li);
            })
        })
    })
    let gravicoinBalanceText = document.querySelector("#gravicoinBalance")
    getCurrentUser((userData) => {
        if ((userData !== undefined) && (userData['graviCoins'] !== undefined)) {
            let gravicoinBalance = userData['graviCoins'];
            gravicoinBalanceText.innerText = "Balance: " + gravicoinBalance + "🪙";
        } else {
            gravicoinBalanceText.innerText = "Balance: " + 0 + "🪙";
        }
    })
}

document.querySelector("form.halloffame-entry > input[type='submit']").onclick = (e) => {
    e.preventDefault();
    let messageTxt = document.querySelector("form.halloffame-entry > input[type='text']").value
    if (messageTxt.length > 0) {
        addHOFMessage(messageTxt, () => {
            updateHallOfFame();
            document.querySelector("form.halloffame-entry > input[type='text']").value = ""
        }, () => {
            let gravicoinBalanceText = document.querySelector("#gravicoinBalance");
            let txt = gravicoinBalanceText.innerText;
            gravicoinBalanceText.innerText = "Not enough Coins... " + txt;
            setTimeout(() => {
                gravicoinBalanceText.innerText = txt;
            }, 2000)
        });
    }
}