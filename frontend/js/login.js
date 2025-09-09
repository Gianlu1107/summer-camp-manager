document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");
    errorElem.textContent = "";

    try {
        const response = await fetch("http://192.168.1.111:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            // login riuscito → salva token/sessione se vuoi
            alert("Login effettuato con successo!");
            // per esempio, redirect al dashboard
            window.location.href = "accoglienza.html";
        } else {
            const err = await response.json();
            errorElem.textContent = err.detail || "Username o password errati";
        }
    } catch (err) {
        errorElem.textContent = "Errore di connessione al server";
        console.error(err);
    }
});