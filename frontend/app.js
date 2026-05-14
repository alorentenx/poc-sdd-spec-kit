function setFeedback(el, message, type) {
  el.textContent = message || "";
  el.className = `feedback ${type || ""}`.trim();
}

function renderEntries(entries) {
  const list = document.getElementById("entries-list");
  list.innerHTML = "";
  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = "No hay entradas para mostrar";
    list.appendChild(li);
    return;
  }
  entries.forEach((entry) => {
    const li = document.createElement("li");
    const date = new Date(entry.createdAt).toLocaleString();
    li.innerHTML = `<div>${entry.text}</div><div class="meta">${date}</div>`;
    list.appendChild(li);
  });
}

async function requestJson(url, options) {
  const res = await fetch(url, options);
  const payload = await res.json();
  if (!res.ok) {
    const msg = payload?.error?.message || "Request failed";
    const err = new Error(msg);
    err.code = payload?.error?.code;
    throw err;
  }
  return payload;
}

async function loadToday() {
  const feedback = document.getElementById("query-feedback");
  setFeedback(feedback, "Cargando...", "");
  try {
    const payload = await requestJson("/api/entries/today");
    renderEntries(payload.entries || []);
    setFeedback(feedback, "Vista de hoy actualizada", "ok");
  } catch (err) {
    setFeedback(feedback, err.message, "error");
  }
}

async function loadRecent() {
  const feedback = document.getElementById("query-feedback");
  const days = document.getElementById("recent-days").value;
  setFeedback(feedback, "Cargando...", "");
  try {
    const payload = await requestJson(`/api/entries/recent?days=${encodeURIComponent(days)}`);
    renderEntries(payload.entries || []);
    setFeedback(feedback, `Últimos ${days} días`, "ok");
  } catch (err) {
    setFeedback(feedback, err.message, "error");
  }
}

async function runSearch() {
  const feedback = document.getElementById("query-feedback");
  const keyword = document.getElementById("search-keyword").value;
  setFeedback(feedback, "Buscando...", "");
  try {
    const payload = await requestJson(`/api/entries/search?keyword=${encodeURIComponent(keyword)}`);
    renderEntries(payload.entries || []);
    setFeedback(feedback, "Búsqueda completada", "ok");
  } catch (err) {
    setFeedback(feedback, err.message, "error");
  }
}

async function submitEntry(event) {
  event.preventDefault();
  const feedback = document.getElementById("entry-feedback");
  const submit = document.getElementById("entry-submit");
  const textNode = document.getElementById("entry-text");
  submit.disabled = true;
  setFeedback(feedback, "Guardando...", "");
  try {
    await requestJson("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textNode.value }),
    });
    textNode.value = "";
    setFeedback(feedback, "Entrada guardada", "ok");
    await loadToday();
  } catch (err) {
    setFeedback(feedback, err.message, "error");
  } finally {
    submit.disabled = false;
  }
}

document.getElementById("entry-form").addEventListener("submit", submitEntry);
document.getElementById("load-today").addEventListener("click", loadToday);
document.getElementById("load-recent").addEventListener("click", loadRecent);
document.getElementById("run-search").addEventListener("click", runSearch);

loadToday();
