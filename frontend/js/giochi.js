const arbitroId = 1; // esempio, da login reale

document.getElementById("arbitroName").textContent = `Arbitro ID: ${arbitroId}`;

async function loadTurni() {
    try {
        const res = await fetch("http://192.168.1.111:5000/giochi/get_turni", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ arbitro_id: arbitroId })
        });

        const turni = await res.json();
        const container = document.getElementById("turniContainer");
        container.innerHTML = "";

        turni.forEach(turno => {
            const card = document.createElement("div");
            card.className = "turnoCard";

            card.innerHTML = `
                <h2>${turno.gioco} (Turno ${turno.turno})</h2>
                <p><strong>Squadra 1:</strong> ${turno.squadra1} <input type="number" class="punteggio" data-squadra="${turno.squadra1}" value="0"></p>
                <p><strong>Squadra 2:</strong> ${turno.squadra2} <input type="number" class="punteggio" data-squadra="${turno.squadra2}" value="0"></p>
                <p><strong>Campo:</strong> ${turno.campo}</p>
                <p><strong>Arbitri:</strong> ${turno.arbitri.join(", ")}</p>
                <div class="timer">00:00</div>
                <button class="startTimer">Start</button>
                <button class="stopTimer">Stop</button>
                <button class="sendScore">Invia Punteggio</button>
            `;

            container.appendChild(card);

            // gestione timer
            let timerInterval;
            const timerEl = card.querySelector(".timer");
            let seconds = 0;

            card.querySelector(".startTimer").addEventListener("click", () => {
                clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    seconds++;
                    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
                    const secs = String(seconds % 60).padStart(2, "0");
                    timerEl.textContent = `${mins}:${secs}`;
                }, 1000);
            });

            card.querySelector(".stopTimer").addEventListener("click", () => clearInterval(timerInterval));

            // invio punteggio
            card.querySelector(".sendScore").addEventListener("click", async () => {
                const punteggio1 = card.querySelector(`input[data-squadra='${turno.squadra1}']`).value;
                const punteggio2 = card.querySelector(`input[data-squadra='${turno.squadra2}']`).value;

                try {
                    const response = await fetch("http://192.168.1.111:5000/giochi/submit_punteggio", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            turno_id: turno.id,
                            punteggio1,
                            punteggio2
                        })
                    });

                    if (response.ok) alert("Punteggio inviato!");
                    else alert("Errore invio punteggio");
                } catch (err) {
                    console.error(err);
                    alert("Errore nella comunicazione con il server");
                }
            });
        });
    } catch (err) {
        console.error(err);
        alert("Errore caricamento turni");
    }
}

window.addEventListener("load", loadTurni);