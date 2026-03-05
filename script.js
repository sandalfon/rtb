const pace630 = [
  "00:06:25",
  "00:06:31",
  "00:06:40",
  "00:06:31",
  "00:06:29",
  "00:06:34",
  "00:06:30",
  "00:06:26",
  "00:06:29",
  "00:06:17",
  "00:06:37",
  "00:06:40",
  "00:06:29",
  "00:06:35",
  "00:06:37",
  "00:06:30",
  "00:06:29",
  "00:06:20",
  "00:06:34",
  "00:06:27",
  "00:06:32",
  "00:06:25",
  "00:06:27",
  "00:06:19",
  "00:06:36",
  "00:06:32",
  "00:06:27",
  "00:06:28",
  "00:06:31",
  "00:06:30",
  "00:06:32",
  "00:06:31",
  "00:06:33",
  "00:06:27",
  "00:06:31",
  "00:06:31",
  "00:06:31",
  "00:06:32",
  "00:06:29",
  "00:06:34",
  "00:06:33",
  "00:06:45",
  "00:03:16",
];

const pace615 = [
  "00:06:10",
  "00:06:16",
  "00:06:25",
  "00:06:16",
  "00:06:14",
  "00:06:18",
  "00:06:15",
  "00:06:11",
  "00:06:14",
  "00:06:03",
  "00:06:21",
  "00:06:24",
  "00:06:14",
  "00:06:20",
  "00:06:21",
  "00:06:15",
  "00:06:14",
  "00:06:06",
  "00:06:19",
  "00:06:12",
  "00:06:17",
  "00:06:10",
  "00:06:12",
  "00:06:05",
  "00:06:20",
  "00:06:17",
  "00:06:12",
  "00:06:13",
  "00:06:16",
  "00:06:15",
  "00:06:17",
  "00:06:16",
  "00:06:18",
  "00:06:12",
  "00:06:16",
  "00:06:16",
  "00:06:16",
  "00:06:17",
  "00:06:14",
  "00:06:18",
  "00:06:18",
  "00:06:29",
  "00:03:09",
];

let pace = pace630;

const tbody = document.querySelector("#table tbody");

/* ---------- TABLE ---------- */

function buildTable() {
  tbody.innerHTML = "";

  let saved = JSON.parse(localStorage.getItem("marathonData") || "{}");

  for (let i = 0; i < 43; i++) {
    let row = document.createElement("tr");
    let km = i + 1;

    if (km == 10) row.classList.add("km10");
    if (km == 21) row.classList.add("km21");
    if (km == 30) row.classList.add("km30");
    if (km == 40) row.classList.add("km40");

    let delay = saved[i]?.delay || 0;
    let rav = saved[i]?.rav || "non";
    let note = saved[i]?.note || "";

    row.innerHTML = `

<td>${km}</td>

<td class="pace">${pace[i]}</td>

<td class="cumul"></td>

<td class="passage"></td>

<td>
<input class="delay" data-km="${i}" value="${delay}">
</td>

<td>
<select class="rav" data-km="${i}">
<option ${rav == "non" ? "selected" : ""}>non</option>
<option ${rav == "plan A" ? "selected" : ""}>plan A</option>
<option ${rav == "plan B" ? "selected" : ""}>plan B</option>
</select>
</td>

<td>
<input class="note" data-km="${i}" value="${note}">
</td>
`;

    tbody.appendChild(row);
  }

  updateTimes();
  saveListeners();
}

/* ---------- TEMPS ---------- */

function toSec(t) {
  let a = t.split(":");
  return +a[0] * 3600 + +a[1] * 60 + +a[2];
}

function format(s) {
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  let ss = s % 60;
  return [h, m, ss].map((v) => String(v).padStart(2, "0")).join(":");
}

function updateTimes() {
  let start = document.getElementById("startTime").value;
  if (!start) return;

  let [h, m] = start.split(":");

  let base = new Date();
  base.setHours(h);
  base.setMinutes(m);
  base.setSeconds(0);

  let cumul = 0;

  tbody.querySelectorAll("tr").forEach((r, i) => {
    let p = pace[i];
    let d = parseInt(r.querySelector(".delay").value) || 0;

    cumul += toSec(p) + d;

    r.querySelector(".cumul").innerText = format(cumul);

    let t = new Date(base.getTime() + cumul * 1000);

    r.querySelector(".passage").innerText = t.toTimeString().slice(0, 8);
  });
}

/* ---------- SAUVEGARDE ---------- */

function saveListeners() {
  document.querySelectorAll(".delay,.rav,.note").forEach((el) => {
    el.addEventListener("change", saveData);
  });
}

function saveData() {
  let data = {};

  tbody.querySelectorAll("tr").forEach((r, i) => {
    data[i] = {
      delay: r.querySelector(".delay").value,
      rav: r.querySelector(".rav").value,
      note: r.querySelector(".note").value,
    };
  });

  localStorage.setItem("marathonData", JSON.stringify(data));

  updateTimes();
}

/* ---------- PACE BUTTONS ---------- */

document.getElementById("pace615").onclick = () => {
  pace = pace615;
  buildTable();
};

document.getElementById("pace630").onclick = () => {
  pace = pace630;
  buildTable();
};

/* ---------- TABS ---------- */

function showTab(id) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));

  document.getElementById(id).classList.add("active");

  if (id === "course") updateCourse();
}

/* ---------- MODE COURSE ---------- */

function updateCourse() {
  let now = new Date();

  document.getElementById("courseTime").innerText = now
    .toTimeString()
    .slice(0, 8);

  let start = document.getElementById("startTime").value;
  if (!start) return;

  let [h, m] = start.split(":");

  let s = new Date();
  s.setHours(h);
  s.setMinutes(m);
  s.setSeconds(0);

  let elapsed = (now - s) / 1000;

  let km = 0;
  let cumul = 0;
  let ravitos = [];

  tbody.querySelectorAll("tr").forEach((r, i) => {
    let p = pace[i];
    let d = parseInt(r.querySelector(".delay").value) || 0;

    cumul += toSec(p) + d;

    let rav = r.querySelector(".rav").value;
    let note = r.querySelector(".note").value;
    let time = r.querySelector(".passage").innerText;

    if (elapsed > cumul) km = i + 1;

    if (rav != "non") {
      ravitos.push({
        km: i + 1,
        rav,
        note,
        time,
        cumul,
      });
    }
  });

  document.getElementById("courseKm").innerText = "KM " + km;

  let html = "";

  ravitos.forEach((r) => {
    let cls =
      r.cumul > elapsed && !html.includes("next") ? "ravito next" : "ravito";

    html += `
<div class="${cls}">
KM ${r.km} - ${r.rav} ${r.note} ${r.time}
</div>
`;
  });

  document.getElementById("ravitoList").innerHTML = html;
}

setInterval(updateCourse, 1000);

/* ---------- URL TAB ---------- */

function loadUrl() {
  let url = document.getElementById("customUrl").value;

  document.getElementById("urlFrame").src = url;

  localStorage.setItem("customUrl", url);
}

function resetUrl() {
  localStorage.removeItem("customUrl");

  document.getElementById("urlFrame").src = "";
  document.getElementById("customUrl").value = "";
}

/* ---------- INIT ---------- */

window.onload = () => {
  buildTable();

  let url = localStorage.getItem("customUrl");

  if (url) {
    document.getElementById("customUrl").value = url;
    document.getElementById("urlFrame").src = url;
  }
};
