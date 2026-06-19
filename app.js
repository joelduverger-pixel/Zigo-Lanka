const API = "https://script.google.com/macros/s/AKfycbyczW7fHLjCuWGfRAPl0xx68JKf1iFR2WdkGeqsFR4rtckE_TKtTFMb-zZVAl_P0rgPJw/exec";

let participants = [];

async function chargerDonnees() {
  try {
    const response = await fetch(API);
    const data = await response.json();

    // Sauvegarde locale pour le mode hors connexion
    localStorage.setItem("zigoData", JSON.stringify(data));

    participants = data.participants || [];
    const historique = data.historique || [];
    const missions = data.missions || [];
    const calendrier = data.calendrier || [];

    afficherClassement();
    afficherHistorique(historique);
    afficherMissions(missions);
    afficherCalendrier(calendrier);
    remplirParticipants();

  } catch (e) {

    console.error(e);

    // Mode hors connexion
    const sauvegarde = localStorage.getItem("zigoData");

    if (sauvegarde) {

      const data = JSON.parse(sauvegarde);

      participants = data.participants || [];
      const historique = data.historique || [];
      const missions = data.missions || [];
      const calendrier = data.calendrier || [];

      afficherClassement();
      afficherHistorique(historique);
      afficherMissions(missions);
      afficherCalendrier(calendrier);
      remplirParticipants();

    } else {

      document.getElementById("classement").innerHTML =
        "❌ Erreur de connexion";

      document.getElementById("historique").innerHTML =
        "❌ Erreur de connexion";

      const mis = document.getElementById("missions");
      if (mis) mis.innerHTML = "❌ Erreur de connexion";

      const cal = document.getElementById("calendrier");
      if (cal) cal.innerHTML = "❌ Erreur de connexion";
    }
  }
}

function afficherClassement() {

  const zone = document.getElementById("classement");

  if (!zone) return;

  let liste = [...participants];

  if (liste.length > 0) liste.shift();

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

  if (!zone) return;

  let liste = [...historique];

  if (liste.length > 0) liste.shift();

  liste.reverse();

  zone.innerHTML = "";

  liste.slice(0, 20).forEach(h => {

    zone.innerHTML += `
      <div class="carte">
        <div>
          <strong>${h[1]}</strong><br>
          ${h[2]}
        </div>

        <div style="text-align:right;">
          +${h[3]} min
        </div>
      </div>
    `;
  });
}

function afficherMissions(missions) {

  const zone = document.getElementById("missions");

  if (!zone) return;

  zone.innerHTML = "";

  if (!missions || missions.length <= 1) {
    zone.innerHTML = "<p>Aucune mission.</p>";
    return;
  }

  const liste = missions.slice(1);

  liste.forEach(m => {

    const type = m[0] || "";
    const mode = m[1] || "";
    const nom = m[2] || "";
    const valeur = m[3] || "";

    // Ignore les lignes sans mission
    if (!nom || nom.trim() === "") return;

    zone.innerHTML += `
      <div class="carte">
        <div>
          <strong>🎯 ${nom}</strong><br>
          ${type} ${mode ? "• " + mode : ""}
        </div>

        <div style="text-align:right;">
          ${valeur ? "+" + valeur + " min" : ""}
        </div>
      </div>
    `;

  });

}
function afficherCalendrier(calendrier) {

  const zone = document.getElementById("calendrier");

  if (!zone) return;

  let liste = [...calendrier];

  if (liste.length > 0) liste.shift();

  zone.innerHTML = "";

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

  if (liste.length > 0) liste.shift();

  select.innerHTML = "";

  liste.forEach(p => {
    select.innerHTML += `
      <option value="${p[0]}">${p[0]}</option>
    `;
  });
}

// Administration
document.getElementById("adminBtn").addEventListener("click", () => {
  document.getElementById("admin").classList.toggle("cache");
});

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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

      chargerDonnees();

    } else {

      document.getElementById("message").innerHTML =
        "❌ Erreur";

    }

  } catch (e) {

    document.getElementById("message").innerHTML =
      "❌ Impossible d'envoyer les données";

  }

});

chargerDonnees();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
