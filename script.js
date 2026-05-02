let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user = JSON.parse(localStorage.getItem("user")) || null;

const products = [
  {
    id: "1",
    name: "Rose Bouquet",
    category: "roses",
    price: 25,
    image: "images/rose.png",
    description: "Elegant red roses for romantic occasions and special moments."
  },
  {
    id: "2",
    name: "Tulip Bouquet",
    category: "gifts",
    price: 30,
    image: "images/rose2.png",
    description: "Fresh tulips with soft and beautiful colors."
  },
  {
    id: "3",
    name: "Wedding Flowers",
    category: "wedding",
    price: 50,
    image: "images/rose3.png",
    description: "Romantic floral design for wedding celebrations."
  },
  {
    id: "4",
    name: "Yellow Flowers",
    category: "gifts",
    price: 22,
    image: "images/yellow.jpg",
    description: "Bright flowers for friendship and happy moments."
  },
  {
    id: "5",
    name: "Rose Formation",
    category: "roses",
    price: 45,
    image: "images/Rose formation.JPG",
    description: "Custom rose arrangements in letters and shapes."
  },
  {
    id: "6",
    name: "Graduation Flowers",
    category: "graduation",
    price: 35,
    image: "images/Graduation flowers.JPG",
    description: "Special bouquets to celebrate graduation success."
  }
];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".my-cart-badge").forEach(badge => {
    badge.innerText = count;
  });
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => toast.remove(), 2500);
}

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-to-cart")) {
    let btn = e.target;

    let product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image,
      quantity: 1
    };

    let existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push(product);
    }

    saveCart();
    showToast("Added to cart 🛒");
  }

  if (e.target.classList.contains("filter-btn")) {
    let category = e.target.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    document.querySelectorAll(".product-item").forEach(item => {
      item.style.display =
        category === "all" || item.dataset.category === category
          ? "block"
          : "none";
    });
  }
});

function renderCartPage() {
  let cartItems = document.getElementById("cartItems");
  let totalItems = document.getElementById("totalItems");
  let totalPrice = document.getElementById("totalPrice");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Go back to the shop and add your favorite flowers.</p>
        <a href="index.html" class="btn-main">Shop Now</a>
      </div>
    `;
    totalItems.innerText = "0";
    totalPrice.innerText = "0";
    return;
  }

  let itemsCount = 0;
  let priceTotal = 0;

  cart.forEach(item => {
    itemsCount += item.quantity;
    priceTotal += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>
        </div>

        <div class="quantity-controls">
          <button onclick="decreaseQuantity('${item.id}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity('${item.id}')">+</button>
        </div>

        <h5>$${item.price * item.quantity}</h5>

        <button class="remove-btn" onclick="removeItem('${item.id}')">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    `;
  });

  totalItems.innerText = itemsCount;
  totalPrice.innerText = priceTotal;
}

function increaseQuantity(id) {
  let item = cart.find(product => product.id === id);
  if (item) item.quantity++;
  saveCart();
  renderCartPage();
}

function decreaseQuantity(id) {
  let item = cart.find(product => product.id === id);

  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  renderCartPage();
}

function removeItem(id) {
  cart = cart.filter(product => product.id !== id);
  saveCart();
  renderCartPage();
  showToast("Item removed");
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartPage();
  showToast("Cart cleared");
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  showToast("Thank you for your order!");
  clearCart();
}

document.addEventListener("keyup", function(e) {
  if (e.target.id === "searchInput") {
    let value = e.target.value.toLowerCase();
    let found = false;

    document.querySelectorAll(".product-item").forEach(product => {
      let name = product.dataset.name.toLowerCase();

      if (name.includes(value)) {
        product.style.display = "block";
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    let msg = document.getElementById("noResults");
    if (msg) msg.style.display = found ? "none" : "block";
  }
});

function renderProductDetails() {
  let container = document.getElementById("productDetails");
  if (!container) return;

  let params = new URLSearchParams(window.location.search);
  let id = params.get("id");

  let product = products.find(p => p.id === id);

  if (!product) {
    container.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  container.innerHTML = `
    <div class="row align-items-center">
      <div class="col-md-6 text-center">
        <img src="${product.image}" class="product-detail-img" alt="${product.name}">
      </div>

      <div class="col-md-6">
        <span class="detail-category">${product.category}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <h3>$${product.price}</h3>

        <button class="btn-buy add-to-cart"
          data-id="${product.id}"
          data-name="${product.name}"
          data-price="${product.price}"
          data-image="${product.image}">
          Add To Cart
        </button>

        <a href="index.html" class="btn-outline-pink ml-2">Back To Shop</a>
      </div>
    </div>
  `;
}

function updateUserNav() {
  let userArea = document.getElementById("userArea");
  if (!userArea) return;

  if (user) {
    userArea.innerHTML = `
      <span class="user-name">Hi, ${user.name}</span>
      <button onclick="logoutUser()" class="logout-btn">Logout</button>
    `;
  } else {
    userArea.innerHTML = `<a class="nav-link" href="login1a.html">Login</a>`;
  }
}

function loginUser() {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showToast("Please fill all fields");
    return false;
  }

  localStorage.setItem("user", JSON.stringify({
    name: email.split("@")[0],
    email: email
  }));

  window.location.href = "index.html";
  return false;
}

function registerUser() {
  let name = document.getElementById("registerName").value;
  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    showToast("Please fill all fields");
    return false;
  }

  localStorage.setItem("user", JSON.stringify({
    name: name,
    email: email
  }));

  window.location.href = "index.html";
  return false;
}

function logoutUser() {
  localStorage.removeItem("user");
  user = null;
  updateUserNav();
  showToast("Logged out");
}

updateCartCount();
renderCartPage();
renderProductDetails();
updateUserNav();