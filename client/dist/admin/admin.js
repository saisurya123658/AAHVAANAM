const rows = document.querySelector("#bookingRows");
const search = document.querySelector("#search");
const status = document.querySelector("#status");
const toast = document.querySelector("#toast");

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

async function api(url, options = {}) {
  const response = await fetch(url, options);
  if (response.status === 401) {
    location.href = "/admin/login.html";
    throw new Error("Session expired.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

async function loadStats() {
  const s = await api("/api/admin/stats");
  document.querySelector("#total").textContent = s.total;
  document.querySelector("#pending").textContent = s.pending;
  document.querySelector("#confirmed").textContent = s.confirmed;
  document.querySelector("#todayCheckins").textContent = s.todayCheckins;
}

async function loadBookings() {
  const params = new URLSearchParams();
  if (search.value.trim()) params.set("q", search.value.trim());
  if (status.value) params.set("status", status.value);

  const data = await api(`/api/admin/bookings?${params.toString()}`);
  if (!data.bookings.length) {
    rows.innerHTML = `<tr><td colspan="9" class="empty">No booking records found.</td></tr>`;
    return;
  }

  rows.innerHTML = data.bookings.map(b => `
    <tr>
      <td><strong>${esc(b.booking_ref)}</strong></td>
      <td><strong>${esc(b.guest_name)}</strong><br>${b.rooms} room${b.rooms > 1 ? "s" : ""}</td>
      <td class="stay">${esc(b.check_in)}<br>to ${esc(b.check_out)}</td>
      <td>${esc(b.room_type)}</td>
      <td>${esc(b.guests)}</td>
      <td class="contact">${esc(b.phone)}<br>${esc(b.email || "—")}</td>
      <td>
        <select class="status-select" data-id="${b.id}">
          ${["Pending","Confirmed","Checked In","Checked Out","Cancelled"].map(s => `<option ${s===b.status?"selected":""}>${s}</option>`).join("")}
        </select>
      </td>
      <td>${esc(b.created_at)}</td>
      <td><button class="delete" data-delete="${b.id}" title="Delete">Delete</button></td>
    </tr>
  `).join("");

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", async () => {
      try {
        await api(`/api/admin/bookings/${select.dataset.id}/status`, {
          method: "PATCH",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({status: select.value})
        });
        showToast("Booking status updated.");
        await loadStats();
      } catch (e) { showToast(e.message); }
    });
  });

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", async () => {
      if (!confirm("Delete this booking record permanently?")) return;
      try {
        await api(`/api/admin/bookings/${button.dataset.delete}`, {method:"DELETE"});
        showToast("Booking deleted.");
        await Promise.all([loadStats(), loadBookings()]);
      } catch (e) { showToast(e.message); }
    });
  });
}

async function init() {
  try {
    const me = await api("/api/admin/me");
    document.querySelector("#adminEmail").textContent = `Signed in as ${me.email}`;
    await Promise.all([loadStats(), loadBookings()]);
  } catch (e) {
    console.error(e);
  }
}

let searchTimer;
search.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadBookings, 250);
});
status.addEventListener("change", loadBookings);
document.querySelector("#refresh").addEventListener("click", () => Promise.all([loadStats(), loadBookings()]));
document.querySelector("#logout").addEventListener("click", async () => {
  await api("/api/admin/logout", {method:"POST"});
  location.href = "/admin/login.html";
});

init();
