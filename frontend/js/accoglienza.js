// recupera i dati dell'utente loggato dal localStorage
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {team_id: 1, team_name: 'rossi'};

// mostra il nome della squadra
document.getElementById("teamName").textContent = `Squadra: ${loggedInUser.team_name}`;

// carica la lista animati
async function loadAnimati() {
    try {
        const squadraId = loggedInUser.team_id;
        const url = new URL("http://localhost:5000/animati/get_animati");
        url.searchParams.append("team_id", squadraId);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Errore nel caricamento animati:", response, errorText);
            throw new Error("Errore nel caricamento animati");
        }

        const animati = await response.json();
        const tbody = document.querySelector("#animatiTable tbody");
        tbody.innerHTML = "";

        animati.forEach((animato) => {
            const tr = document.createElement("tr");
            tr.dataset.id = animato.id;

            const nameTd = document.createElement("td");
            nameTd.textContent = `${(animato.first_name || '').trim()} ${(animato.last_name || '').trim()}`;

            const presenzaTd = document.createElement("td");
            const presenzaCheckbox = document.createElement("input");
            presenzaCheckbox.type = "checkbox";
            presenzaCheckbox.checked = animato.present || false;
            presenzaTd.appendChild(presenzaCheckbox);

            const pranzoTd = document.createElement("td");
            const pranzoCheckbox = document.createElement("input");
            pranzoCheckbox.type = "checkbox";
            pranzoCheckbox.checked = animato.lunch || false;
            pranzoTd.appendChild(pranzoCheckbox);

            tr.appendChild(nameTd);
            tr.appendChild(presenzaTd);
            tr.appendChild(pranzoTd);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Errore nel caricamento dei dati.";
    }
}

// salva i dati aggiornati
async function saveAnimati() {
    const rows = document.querySelectorAll("#animatiTable tbody tr");
    const data = Array.from(rows).map((row) => {
        const id = parseInt(row.dataset.id, 10);
        const present = row.children[1].querySelector("input").checked;
        const lunch = row.children[2].querySelector("input").checked;
        return { id, present, lunch };
    });

    if (data.length === 0) {
        document.getElementById("message").textContent = "Nessun dato da salvare";
        return;
    }

    console.log("Dati inviati al backend:", data);

    try {
        const response = await fetch("http://localhost:5000/animati/send_animati", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kids: data })
        });

        if (response.ok) {
            document.getElementById("message").textContent = "Dati salvati con successo!";
        } else {
            const errorText = await response.text();
            console.error("Errore nel salvataggio:", errorText);
            document.getElementById("message").textContent = "Errore durante il salvataggio.";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Errore durante il salvataggio.";
    }
}

document.getElementById("saveButton").addEventListener("click", saveAnimati);
window.addEventListener("load", loadAnimati);