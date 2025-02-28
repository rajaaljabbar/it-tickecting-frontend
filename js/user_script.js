// Cek apakah sudah login
const namaUser = localStorage.getItem("userNama");
const emailUser = localStorage.getItem("userEmail");

if (!emailUser) {
  alert("Silakan login terlebih dahulu.");
  window.location.href = "index.html";
} else {
  document.getElementById("dashboardHeader").innerText = `Hi ${namaUser}`;
  document.getElementById("nama").value = namaUser;
  document.getElementById("email").value = emailUser;
}

// Mendapatkan daftar Dept.
const loadDepartments = async () => {
  try {
    const response = await fetch("http://172.17.20.5:7000/api/departments");
    const departments = await response.json();

    const deptDropdown = document.getElementById("dept");
    deptDropdown.innerHTML = '<option value="">-- Choose Dept. --</option>';

    departments.forEach((dept) => {
      const option = document.createElement("option");
      option.value = dept.nama_dept;
      option.textContent = dept.nama_dept;
      deptDropdown.appendChild(option);
    });

    console.log("Dept. yang dimuat:", departments); // Cek di console
  } catch (error) {
    console.error("Gagal mendapatkan Dept.:", error);
  }
};

// Panggil saat halaman dimuat
window.addEventListener("load", loadDepartments);

// Mengajukan Tiket
document.getElementById("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nama: document.getElementById("nama").value,
    email: document.getElementById("email").value,
    dept: document.getElementById("dept").value,
    no_hp: document.getElementById("no_hp").value,
    deskripsi: document.getElementById("deskripsi").value,
    prioritas: document.getElementById("prioritas").value,
  };

  console.log("Data tiket yang akan diajukan:", data); // Tambahkan ini

  try {
    const response = await fetch("http://172.17.20.5:7000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Response dari server:", result); // Tambahkan ini

    if (response.ok) {
      alert(result.message);
      loadUserTickets(data.email); // Reload daftar tiket
    } else {
      alert("Gagal mengajukan tiket.");
    }
  } catch (error) {
    console.error("Gagal mengajukan tiket:", error);
  }
});

// Mendapatkan daftar tiket user
const loadUserTickets = async () => {
  const emailUser = localStorage.getItem("userEmail"); // Ambil email dari localStorage

  if (!emailUser) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(
      `http://172.17.20.5:7000/api/tickets?email=${emailUser}`
    );
    const tickets = await response.json();

    const ticketList = document.querySelector("#ticketList");
    ticketList.innerHTML = "";

    tickets.forEach((ticket, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${ticket.dept}</td>
                <td>${ticket.deskripsi}</td>
                <td>${ticket.prioritas}</td>
                <td>${ticket.status}</td>
                <td>${new Date(ticket.tanggal).toLocaleString()}</td>
                        <td><button onclick="deleteTicket(${
                          ticket.id
                        })">Drop Ticket</button></td>

            `;
      ticketList.appendChild(row);
    });

    console.log("Tiket yang dimuat:", tickets); // Tambahkan ini untuk cek data tiket
  } catch (error) {
    console.error("Gagal mendapatkan tiket:", error);
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

// Panggil saat halaman dimuat
window.addEventListener("load", loadUserTickets);

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userNama");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});
