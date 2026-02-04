
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    alert("Access Denied: Admins only");
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}


const form = document.getElementById("productForm");
const categorySelect = document.getElementById("category");


async function loadCategories() {
    try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        
        const cats = await res.json();
        
        
        categorySelect.innerHTML = `<option value="">-- Select a Category --</option>`;
        
        cats.forEach(c => {

            categorySelect.innerHTML += `<option value="${c._id}">${c.name}</option>`;
        });
    } catch (err) {
        console.error("Category Load Error:", err);
    }
}
loadCategories();


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const categoryId = document.getElementById("category").value; 
    const imageFile = document.getElementById("image").files[0];

    if (!categoryId) {
        alert("Please select a category!");
        return;
    }
    if (!imageFile) {
        alert("Please upload a product image!");
        return;
    }

    
    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("description", description);
    data.append("category", categoryId); 
    data.append("image", imageFile);

    try {
        const res = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                
            },
            body: data
        });

        const result = await res.json();

        if (res.ok) {
            alert("Product added successfully! 🚀");
            form.reset();
        } else {
            
            alert("Error: " + (result.message || result.error));
        }
    } catch (err) {
        console.error("Submission Error:", err);
        alert("Server connection failed. Is the backend running?");
    }
});
