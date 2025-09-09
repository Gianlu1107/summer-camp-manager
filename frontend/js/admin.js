document.addEventListener("DOMContentLoaded", () => {
    // Utility for showing feedback/errors
    function showMessage(message, isError = false) {
        let msgDiv = document.getElementById("admin-message");
        if (!msgDiv) {
            msgDiv = document.createElement("div");
            msgDiv.id = "admin-message";
            msgDiv.style.position = "fixed";
            msgDiv.style.top = "10px";
            msgDiv.style.left = "50%";
            msgDiv.style.transform = "translateX(-50%)";
            msgDiv.style.padding = "10px 20px";
            msgDiv.style.zIndex = "1000";
            msgDiv.style.borderRadius = "6px";
            msgDiv.style.fontWeight = "bold";
            document.body.appendChild(msgDiv);
        }
        msgDiv.textContent = message;
        msgDiv.style.background = isError ? "#ffdddd" : "#ddffdd";
        msgDiv.style.color = isError ? "#b80000" : "#006600";
        msgDiv.style.display = "block";
        setTimeout(() => { msgDiv.style.display = "none"; }, 3000);
    }

    // SWITCH TAB
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const tab = btn.dataset.tab;
            tabContents.forEach(c => c.classList.remove("active"));
            document.getElementById(tab).classList.add("active");
        });
    });

    // MODAL
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.querySelector(".close");
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

    // -------------------------
    // UTENTI
    // -------------------------
    const usersTableBody = document.querySelector("#usersTable tbody");
    async function loadUsers() {
        usersTableBody.innerHTML = "";
        try {
            const res = await fetch("/admin/users", { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento utenti");
            const users = await res.json();
            users.forEach(u => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${u.username}</td>
                    <td>${u.role}</td>
                    <td>${u.team_id || ""}</td>
                    <td>
                        <button onclick="editUser(${u.id})">Edit</button>
                        <button onclick="deleteUser(${u.id})">Delete</button>
                    </td>
                `;
                usersTableBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento utenti", true);
        }
    }

    window.editUser = async (id) => {
        // Fetch user data and show form
        try {
            const res = await fetch(`/admin/users/${id}`, { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento utente");
            const u = await res.json();
            modalBody.innerHTML = `
                <h3>Modifica Utente</h3>
                <form id="editUserForm">
                    <label>Username: <input type="text" name="username" value="${u.username}" required></label><br>
                    <label>Ruolo: <input type="text" name="role" value="${u.role}" required></label><br>
                    <label>Squadra ID: <input type="number" name="team_id" value="${u.team_id || ""}"></label><br>
                    <button type="submit">Salva</button>
                </form>
            `;
            modal.style.display = "flex";
            document.getElementById("editUserForm").onsubmit = async (e) => {
                e.preventDefault();
                const form = e.target;
                const body = {
                    username: form.username.value,
                    role: form.role.value,
                    team_id: form.team_id.value ? Number(form.team_id.value) : null
                };
                try {
                    const resp = await fetch(`/admin/users/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });
                    if (!resp.ok) throw new Error("Errore modifica utente");
                    showMessage("Utente modificato!");
                    modal.style.display = "none";
                    loadUsers();
                } catch (err) {
                    console.error(err);
                    showMessage("Errore durante modifica utente", true);
                }
            };
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento dati utente", true);
        }
    };

    window.deleteUser = async (id) => {
        if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;
        try {
            const res = await fetch(`/admin/users/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore eliminazione utente");
            showMessage("Utente eliminato!");
            loadUsers();
        } catch (err) {
            console.error(err);
            showMessage("Errore durante eliminazione utente", true);
        }
    };
    loadUsers();

    // -------------------------
    // SQUADRE & ANIMATI
    // -------------------------
    const teamsTableBody = document.querySelector("#teamsTable tbody");
    const animatiTableBody = document.querySelector("#animatiTable tbody");

    async function loadTeams() {
        teamsTableBody.innerHTML = "";
        try {
            const res = await fetch("/admin/teams", { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento squadre");
            const teams = await res.json();
            teams.forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${t.name}</td>
                    <td>${t.color}</td>
                    <td>${t.total_score}</td>
                    <td><button onclick="showAnimati(${t.id})">Visualizza Animati</button></td>
                `;
                teamsTableBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento squadre", true);
        }
    }

    window.showAnimati = async (teamId) => {
        animatiTableBody.innerHTML = "";
        try {
            const res = await fetch(`/animati/get_animati/${teamId}`, { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento animati");
            const kids = await res.json();
            kids.forEach(k => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${k.first_name} ${k.last_name}</td>
                    <td><input type="checkbox" ${k.present ? "checked" : ""} data-kidid="${k.id}" data-field="present"></td>
                    <td><input type="checkbox" ${k.lunch ? "checked" : ""} data-kidid="${k.id}" data-field="lunch"></td>
                `;
                animatiTableBody.appendChild(tr);
            });
            // Add event listeners for checkbox update
            animatiTableBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener("change", async (e) => {
                    const kidId = e.target.getAttribute("data-kidid");
                    const field = e.target.getAttribute("data-field");
                    const value = e.target.checked;
                    try {
                        const resp = await fetch(`/animati/update_animato/${kidId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ [field]: value })
                        });
                        if (!resp.ok) throw new Error("Errore aggiornamento animato");
                        showMessage("Dati animato aggiornati");
                    } catch (err) {
                        console.error(err);
                        showMessage("Errore aggiornamento animato", true);
                    }
                });
            });
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento animati", true);
        }
    };

    loadTeams();

    // -------------------------
    // TURNI GIOCHI & ARBITRI
    // -------------------------
    const gamesTableBody = document.querySelector("#gamesTable tbody");
    async function loadGames() {
        gamesTableBody.innerHTML = "";
        try {
            const res = await fetch("/admin/games", { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento giochi");
            const games = await res.json();
            games.forEach(g => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${g.turno}</td>
                    <td>${g.name}</td>
                    <td>${g.team1}</td>
                    <td>${g.team2}</td>
                    <td>${Array.isArray(g.referees) ? g.referees.join(", ") : g.referees}</td>
                    <td>${g.campo}</td>
                    <td>
                        <button onclick="editGame(${g.id})">Edit</button>
                        <button onclick="deleteGame(${g.id})">Delete</button>
                    </td>
                `;
                gamesTableBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento giochi", true);
        }
    }

    window.editGame = async (id) => {
        try {
            const res = await fetch(`/admin/games/${id}`, { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento gioco");
            const g = await res.json();
            modalBody.innerHTML = `
                <h3>Modifica Gioco</h3>
                <form id="editGameForm">
                    <label>Nome: <input type="text" name="name" value="${g.name}" required></label><br>
                    <label>Turno: <input type="text" name="turno" value="${g.turno}" required></label><br>
                    <label>Team 1: <input type="text" name="team1" value="${g.team1}" required></label><br>
                    <label>Team 2: <input type="text" name="team2" value="${g.team2}" required></label><br>
                    <label>Referees (CSV): <input type="text" name="referees" value="${Array.isArray(g.referees) ? g.referees.join(',') : g.referees}"></label><br>
                    <label>Campo: <input type="text" name="campo" value="${g.campo}"></label><br>
                    <button type="submit">Salva</button>
                </form>
            `;
            modal.style.display = "flex";
            document.getElementById("editGameForm").onsubmit = async (e) => {
                e.preventDefault();
                const form = e.target;
                const body = {
                    name: form.name.value,
                    turno: form.turno.value,
                    team1: form.team1.value,
                    team2: form.team2.value,
                    referees: form.referees.value.split(",").map(s => s.trim()),
                    campo: form.campo.value
                };
                try {
                    const resp = await fetch(`/admin/games/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });
                    if (!resp.ok) throw new Error("Errore modifica gioco");
                    showMessage("Gioco modificato!");
                    modal.style.display = "none";
                    loadGames();
                } catch (err) {
                    console.error(err);
                    showMessage("Errore durante modifica gioco", true);
                }
            };
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento dati gioco", true);
        }
    };

    window.deleteGame = async (id) => {
        if (!confirm("Sei sicuro di voler eliminare questo gioco?")) return;
        try {
            const res = await fetch(`/admin/games/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore eliminazione gioco");
            showMessage("Gioco eliminato!");
            loadGames();
        } catch (err) {
            console.error(err);
            showMessage("Errore durante eliminazione gioco", true);
        }
    };
    loadGames();

    // -------------------------
    // CLASSIFICA
    // -------------------------
    const leaderboardBody = document.querySelector("#leaderboardTable tbody");
    async function loadLeaderboard() {
        leaderboardBody.innerHTML = "";
        try {
            const res = await fetch("/admin/leaderboard", { method: "GET" });
            if (!res.ok) throw new Error("Errore caricamento classifica");
            const leaderboard = await res.json();
            leaderboard.forEach(l => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${l.team_name}</td>
                    <td>${l.total_points}</td>
                    <td>${l.average_points}</td>
                `;
                leaderboardBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            showMessage("Errore nel caricamento classifica", true);
        }
    }
    loadLeaderboard();
});