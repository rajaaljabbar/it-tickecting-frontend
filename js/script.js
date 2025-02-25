document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:7000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      localStorage.setItem("userNama", result.nama);
      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userRole", result.role);

      if (result.role === "Admin") {
        window.location.href = "admin_dashboard.html";
      } else {
        window.location.href = "user_dashboard.html";
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Gagal login:", error);
    alert("Gagal login. Coba lagi.");
  }
});
