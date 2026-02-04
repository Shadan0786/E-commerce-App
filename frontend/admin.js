/* --- AUTHENTICATION CHECK --- */
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Check immediately before doing anything else
if (!token || role !== "admin") {
    alert("Access Denied: Admins only");
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

/* --- DOM ELEMENTS --- */
const form = document.getElementById("productForm");
const categorySelect = document.getElementById("category");

/* --- LOAD CATEGORIES --- */
async function loadCategories() {
    try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        
        const cats = await res.json();
        
        // Clear and add placeholder
        categorySelect.innerHTML = `<option value="">-- Select a Category --</option>`;
        
        cats.forEach(c => {
            // FIX: Ensure value is the database _id
            categorySelect.innerHTML += `<option value="${c._id}">${c.name}</option>`;
        });
    } catch (err) {
        console.error("Category Load Error:", err);
    }
}
loadCategories();

/* --- ADD PRODUCT --- */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Capture values
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const categoryId = document.getElementById("category").value; // This is the ID
    const imageFile = document.getElementById("image").files[0];

    // 2. VALIDATION: Prevent the "Cast to ObjectId failed" error
    if (!categoryId) {
        alert("Please select a category!");
        return;
    }
    if (!imageFile) {
        alert("Please upload a product image!");
        return;
    }

    // 3. Prepare FormData
    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("description", description);
    data.append("category", categoryId); // Sending the 24-char hex string
    data.append("image", imageFile);

    try {
        const res = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // IMPORTANT: Do NOT add 'Content-Type' here. 
                // Browser sets it automatically for FormData.
            },
            body: data
        });

        const result = await res.json();

        if (res.ok) {
            alert("Product added successfully! 🚀");
            form.reset();
        } else {
            // This will now catch the error message from your backend try/catch
            alert("Error: " + (result.message || result.error));
        }
    } catch (err) {
        console.error("Submission Error:", err);
        alert("Server connection failed. Is the backend running?");
    }
});