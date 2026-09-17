const form = document.querySelector("#bookingForm");
const message = document.querySelector("#bookingMessage");

if (form) {
  const today = new Date().toISOString().slice(0, 10);
  form.checkIn.min = today;
  form.checkOut.min = today;

  form.checkIn.addEventListener("change", () => {
    form.checkOut.min = form.checkIn.value || today;
    if (form.checkOut.value && form.checkOut.value <= form.checkIn.value) {
      form.checkOut.value = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "Sending your booking request…";

    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Could not submit booking.");

      message.textContent = `Request received. Your booking reference is ${result.bookingRef}. Please call 96402 89999 for confirmation.`;
      form.reset();
      form.rooms.value = 1;
      form.guests.value = 1;
      form.checkIn.min = new Date().toISOString().slice(0, 10);
      form.checkOut.min = form.checkIn.min;
    } catch (error) {
      message.textContent = error.message;
    }
  });
}
