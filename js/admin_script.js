// Cek apakah sudah login dan role adalah Admin
const namaUser = localStorage.getItem("userNama");
const emailUser = localStorage.getItem("userEmail");
const roleUser = localStorage.getItem("userRole");

if (!emailUser || roleUser !== "Admin") {
  alert("Silakan login sebagai Admin terlebih dahulu.");
  window.location.href = "index.html";
} else {
  document.getElementById(
    "dashboardHeader"
  ).innerText = `Halo Admin - (${namaUser})`;
}

// Mendapatkan semua tiket
const loadAllTickets = async () => {
  try {
    const response = await fetch("http://172.17.20.5:7000/api/tickets/all");
    const tickets = await response.json();

    const ticketList = document.querySelector("#adminTicketList");
    ticketList.innerHTML = "";

    tickets.forEach((ticket, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${ticket.nama}</td>
        <td>${ticket.dept}</td>
        <td>${ticket.deskripsi}</td>
        <td>${ticket.prioritas}</td>
        <td>
          <select onchange="updateStatus(${ticket.id}, this.value)">
            <option value="Open" ${
              ticket.status === "Open" ? "selected" : ""
            }>Open</option>
            <option value="In Progress" ${
              ticket.status === "In Progress" ? "selected" : ""
            }>In Progress</option>
            <option value="Resolved" ${
              ticket.status === "Resolved" ? "selected" : ""
            }>Resolved</option>
          </select>
        </td>
        <td>${new Date(ticket.tanggal).toISOString().split("T")[0]}</td>
        <td><button onclick="deleteTicket(${ticket.id})">Delete</button></td>
      `;
      ticketList.appendChild(row);
    });

    console.log("Semua tiket yang dimuat:", tickets); // Debugging
  } catch (error) {
    console.error("Gagal mendapatkan semua tiket:", error);
  }
};

// Update status tiket
const updateStatus = async (id, status) => {
  try {
    const response = await fetch(
      `http://172.17.20.5:7000/api/tickets/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (response.ok) {
      alert("Status tiket berhasil diperbarui.");
      loadAllTickets(); // Reload daftar tiket
    } else {
      alert("Gagal memperbarui status tiket.");
    }
  } catch (error) {
    console.error("Gagal memperbarui status tiket:", error);
  }
};

function deleteTicket(id) {
  if (confirm("Apakah Anda yakin ingin menghapus tiket ini?")) {
    fetch(`http://172.17.20.5:7000/api/tickets/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Tiket berhasil dihapus.");
          location.reload(); // Refresh halaman setelah hapus
        } else {
          alert("Gagal menghapus tiket.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function filterTickets() {
  // Ambil nilai filter
  const filterTanggal = document.getElementById("filter-tanggal").value;
  const filterDept = document.getElementById("filter-dept").value.toLowerCase();
  const filterPriority = document
    .getElementById("filter-priority")
    .value.toLowerCase();

  // Ambil semua baris tabel
  const tableRows = document.querySelectorAll("#adminTiketTable tbody tr");

  tableRows.forEach((row) => {
    // Ambil data dari kolom Dept., Tanggal, dan Priority
    const dept = row
      .querySelector("td:nth-child(3)")
      .textContent.toLowerCase()
      .trim();
    const priority = row
      .querySelector("td:nth-child(5)")
      .textContent.toLowerCase()
      .trim();
    const tanggal = row.querySelector("td:nth-child(7)").textContent.trim();

    // Ubah format tanggal dari tabel ke YYYY-MM-DD
    const tanggalFormatted = tanggal
      .split(",")[0]
      .split("/")
      .reverse()
      .join("-");

    // Cek kecocokan filter
    const isDeptMatch = filterDept ? dept === filterDept : true;
    const isPriorityMatch = filterPriority ? priority === filterPriority : true;
    const isTanggalMatch = filterTanggal
      ? tanggalFormatted === filterTanggal
      : true;

    // Tampilkan atau sembunyikan baris
    if (isDeptMatch && isPriorityMatch && isTanggalMatch) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Panggil saat halaman dimuat
window.addEventListener("load", loadAllTickets);

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userNama");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});
