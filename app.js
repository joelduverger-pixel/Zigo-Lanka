const API = "https://script.google.com/macros/s/AKfycbyczW7fHLjCuWGfRAPl0xx68JKf1iFR2WdkGeqsFR4rtckE_TKtTFMb-zZVAl_P0rgPJw/exec";

let participants = [];

async function chargerDonnees() {
  try {
    const response = await fetch(API);
    const data = await response.json();

    participants = data.participants || [];
    const historique = data.historique || [];
    const calendrier = data.calendrier || [];

    afficherClassement();
    afficherHistorique(historique);
    afficherCalendrier(calendrier);
    remplirParticipants();

  } catch (e) {
    alert("Erreur API : " + e.message);
    console.error(e);

    document.getElementById("classement").innerHTML =
      "❌ Erreur de connexion";

    document.getElementById("historique").innerHTML =
      "❌ Erreur de connexion";

    const cal = document.getElementById("calendrier");
    if (cal) {
      cal.innerHTML = "❌ Erreur de connexion";
    }
  }
}

function afficherClassement() {
  const zone = document.getElementById("classement");

  let liste = [...participants];

  if (liste.length > 0) {
    liste.shift(); // enlève l'en-tête
  }

  liste.sort((a, b) => Number(b[1]) - Number(a[1]));

  zone.innerHTML = "";

  liste.forEach((p, index) => {
    zone.innerHTML += `
      <div class="carte">
        <span>${index + 1}. ${p[0]}</span>
        <strong>${p[1]} min</strong>
      </div>
    `;
  });
}

function afficherHistorique(historique) {
  const zone = document.getElementById("historique");

  let liste = [...historique];

  if (liste.length > 0) {
    liste.shift();
  }

  liste.reverse();

  zone.innerHTML = "";

  if (liste.length === 0) {
    zone.innerHTML = "<p>Aucun événement.</p>";
    return;
  }

  liste.slice(0, 20).forEach(h => {

    const date = new Date(h[0]);

const heure = date.toLocaleString("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

    zone.innerHTML += `
      <div class="carte">
        <div>
          <strong>${h[1]}</strong><br>
          ${h[2]}
        </div>

        <div style="text-align:right;">
          +${h[3]} min<br>
          <small>${heure}</small>
        </div>
      </div>
    `;
  });
}

function afficherCalendrier(calendrier) {
  const zone = document.getElementById("calendrier");

  if (!zone) return;

  let liste = [...calendrier];

  if (liste.length > 0) {
    liste.shift();
  }

  zone.innerHTML = "";

  if (liste.length === 0) {
    zone.innerHTML = "<p>Aucune étape.</p>";
    return;
  }

  liste.forEach(etape => {
    zone.innerHTML += `
      <div class="carte">
        <div>
          <strong>${etape[0]}</strong><br>
          📍 ${etape[1]}
        </div>

        <div style="text-align:right;">
          ${etape[2]}
        </div>
      </div>
    `;
  });
}

function remplirParticipants() {
  const select = document.getElementById("participant");

  if (!select) return;

  let liste = [...participants];

  if (liste.length > 0) {
    liste.shift();
  }

  select.innerHTML = "";

  liste.forEach(p => {
    select.innerHTML += `
      <option value="${p[0]}">${p[0]}</option>
    `;
  });
}

// Bouton administration
document.getElementById("adminBtn").addEventListener("click", () => {
  document.getElementById("admin").classList.toggle("cache");
});

// Vérification du code
document.getElementById("ouvrirAdmin").addEventListener("click", () => {
  const code = document.getElementById("code").value;

  if (code === "Zigo26") {
    document.getElementById("zoneAdmin").classList.remove("cache");
  } else {
    alert("Code incorrect");
  }
});

// Boutons rapides
document.querySelectorAll(".plus").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("minutes").value = btn.dataset.v;
  });
});

// Ajouter des minutes
document.getElementById("ajouter").addEventListener("click", async () => {

  const nom = document.getElementById("participant").value;
  const minutes = Number(document.getElementById("minutes").value);
  const action = document.getElementById("motif").value;

  if (!action) {
    alert("Motif obligatoire");
    return;
  }

  try {

    const response = await fetch(API, {
      method: "POST",
      body: JSON.stringify({
        nom,
        minutes,
        action
      })
    });

    const result = await response.json();

    if (result.success) {

      document.getElementById("message").innerHTML =
        "✅ Ajout enregistré";

      document.getElementById("minutes").value = "";
      document.getElementById("motif").value = "";

      chargerDonnees();

    } else {

      document.getElementById("message").innerHTML =
        "❌ Erreur";

    }

  } catch (e) {

    alert("Erreur POST : " + e.message);

    document.getElementById("message").innerHTML =
      "❌ Impossible d'envoyer les données";

  }

});

chargerDonnees();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}