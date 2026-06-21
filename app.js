const API = "https://script.google.com/macros/s/AKfycbyczW7fHLjCuWGfRAPl0xx68JKf1iFR2WdkGeqsFR4rtckE_TKtTFMb-zZVAl_P0rgPJw/exec";

let participants = [];

async function chargerDonnees() {

try {

```
const response = await fetch(API);
const data = await response.json();

localStorage.setItem("zigoData", JSON.stringify(data));

participants = data.participants || [];
const historique = data.historique || [];
const missions = data.missions || [];
const calendrier = data.calendrier || [];

afficherClassement();

afficherHistorique(historique);

afficherMissions(missions);

afficherCalendrier(calendrier);

```

} catch (e) {

```
console.error("Erreur API :", e);

const sauvegarde = localStorage.getItem("zigoData");

if (sauvegarde) {

  const data = JSON.parse(sauvegarde);

  participants = data.participants || [];

  afficherClassement();
  afficherHistorique(data.historique || []);
  afficherMissions(data.missions || []);
  afficherCalendrier(data.calendrier || []);
  remplirParticipants();

} else {

  const ids = [
    "classement",
    "historique",
    "missions",
    "calendrier"
  ];

  ids.forEach(id => {
    const zone = document.getElementById(id);
    if (zone) zone.innerHTML = "❌ Erreur de connexion";
  });

}
```

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

```
zone.innerHTML += `
  <div class="carte">
    <span>${index + 1}. ${p[0]}</span>
    <strong>${p[1]} min</strong>
  </div>
`;
```

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

```
zone.innerHTML += `
  <div class="carte">
    <div>
      <strong>${h[1]}</strong><br>
      ${h[2]}
    </div>

    <div>
      +${h[3]} min
    </div>
  </div>
`;
```

});

}

function afficherMissions(missions) {

  const zone = document.getElementById("missions");

  if (!zone) return;

  zone.innerHTML = "";

  if (!missions || missions.length <= 1) {
    zone.innerHTML = "Aucune mission";
    return;
  }

function afficherMissions(missions) {

  const zone = document.getElementById("missions");

  if (!zone) return;

  zone.innerHTML = "";

  if (!missions || missions.length <= 1) {
    zone.innerHTML = "Aucune mission";
    return;
  }

  const liste = missions.slice(1);

  liste.forEach(m => {

    const type = m[0] || "";
    const mode = m[1] || "";
    const mission = m[2] || "";
    const valeur = m[3] || "";

    if (!mission) return;

    zone.innerHTML += `
      <div class="carte">
        <div>
          <strong>${mission}</strong><br>
          ${type} • ${mode}
        </div>

        <div>
          +${valeur} min
        </div>
      </div>
    `;

  });

}

const liste = missions.slice(1);

liste.forEach(m => {

```
const type = m[0] || "";
const mode = m[1] || "";
const mission = m[2] || "";
const valeur = m[3] || "";

if (!mission) return;

zone.innerHTML += `
  <div class="carte">
    <div>
      <strong>${mission}</strong><br>
      ${type} • ${mode}
    </div>

    <div>
      +${valeur} min
    </div>
  </div>
`;
```

});

}

function afficherCalendrier(calendrier) {

const zone = document.getElementById("calendrier");
if (!zone) return;

let liste = [...calendrier];

if (liste.length > 0) liste.shift();

zone.innerHTML = "";

liste.forEach(etape => {

```
zone.innerHTML += `
  <div class="carte">
    <div>
      <strong>${etape[0]}</strong><br>
      📍 ${etape[1]}
    </div>

    <div>
      ${etape[2]}
    </div>
  </div>
`;
```

});

}

function remplirParticipants() {

const select = document.getElementById("participant");
if (!select) return;

let liste = [...participants];

if (liste.length > 0) liste.shift();

select.innerHTML = "";

liste.forEach(p => {

```
select.innerHTML += `
  <option value="${p[0]}">${p[0]}</option>
`;
```

});

}

const adminBtn = document.getElementById("adminBtn");

if (adminBtn) {

adminBtn.addEventListener("click", () => {

```
document.getElementById("admin").classList.toggle("cache");
```

});

}

const ouvrirAdmin = document.getElementById("ouvrirAdmin");

if (ouvrirAdmin) {

ouvrirAdmin.addEventListener("click", () => {

```
const code = document.getElementById("code").value;

if (code === "Zigo26") {

  document.getElementById("zoneAdmin").classList.remove("cache");

} else {

  alert("Code incorrect");

}
```

});

}

document.querySelectorAll(".plus").forEach(btn => {

btn.addEventListener("click", () => {

```
document.getElementById("minutes").value = btn.dataset.v;
```

});

});

const ajouterBtn = document.getElementById("ajouter");

if (ajouterBtn) {

ajouterBtn.addEventListener("click", async () => {

```
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

  }

} catch (e) {

  document.getElementById("message").innerHTML =
    "❌ Impossible d'envoyer les données";

}
```

});

}

chargerDonnees();

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("service-worker.js");
}
