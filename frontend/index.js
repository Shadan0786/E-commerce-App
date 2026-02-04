function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("categoryFilter");

let allProducts = [];


async function loadCategories() {
  const res = await fetch("http://localhost:5000/api/categories");
  const categories = await res.json();

  categorySelect.innerHTML = `<option value="">All</option>`;
  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
  });
}


async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(products) {
  productsDiv.innerHTML = "";
  products.forEach(p => {
    productsDiv.innerHTML += `
      <div class="card">
        <img src="http://localhost:5000/${p.image}" />
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <small>${p.category?.name || ""}</small>
      </div>
    `;
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  renderProducts(allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  ));
});


categorySelect.addEventListener("change", () => {
  const value = categorySelect.value;
  if (!value) return renderProducts(allProducts);
  renderProducts(allProducts.filter(p => p.category?._id === value));
});

loadCategories();
loadProducts();
