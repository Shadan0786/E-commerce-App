
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Redirecting to login...");
        window.location.href = "login.html"; 
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Cannot connect to server. Is your backend running on port 5000?");
    }
  });