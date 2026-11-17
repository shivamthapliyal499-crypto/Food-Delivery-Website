// ================= MENU DATA =================
const menuItems = [
  {
    id: 1,
    name: "Smoky Double Smash Burger",
    category: "burgers",
    price: 13.99,
    description: "Two seared beef patties, aged cheddar, caramelized onions, pickles, and smoky house sauce on a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Wood-Fired Margherita Pizza",
    category: "pizza",
    price: 15.49,
    description: "San Marzano tomato sauce, fresh fior di latte mozzarella, sweet basil leaves, and extra-virgin olive oil.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Dragon Roll Sushi Platter",
    category: "asian",
    price: 16.99,
    description: "8 pieces of shrimp tempura and cucumber roll topped with thinly sliced avocado, eel glaze, and toasted sesame.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Creamy Truffle Fettuccine",
    category: "mains",
    price: 14.99,
    description: "Al dente ribbon pasta tossed in roasted garlic parmesan cream sauce with sautéed wild mushrooms and black truffle oil.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Mediterranean Avocado Salad",
    category: "mains",
    price: 11.49,
    description: "Crisp romaine, Haas avocado, cherry tomatoes, Kalamata olives, feta cheese, and lemon-herb vinaigrette.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Spicy Pepperoni Hot Honey Pizza",
    category: "pizza",
    price: 16.99,
    description: "Crispy cupped pepperoni, melted mozzarella, crushed red pepper flakes, and a drizzle of chili-infused honey.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Crispy Spicy Chicken Sandwich",
    category: "burgers",
    price: 12.49,
    description: "Buttermilk fried chicken thigh tossed in Nashville hot glaze with crunchy coleslaw and dill pickles.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Molten Chocolate Lava Cake",
    category: "desserts",
    price: 8.99,
    description: "Warm dark chocolate cake with a gooey ganache center, dusted with powdered sugar and served with vanilla bean cream.",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80"
  }
];

// ================= STATE MANAGEMENT =================
let cart = [];
let activeCategory = "all";
let searchQuery = "";
const DELIVERY_FEE = 3.99;

// ================= DOM ELEMENTS =================
const menuGrid = document.getElementById("menuGrid");
const filterBar = document.getElementById("filterBar");
const searchInput = document.getElementById("searchInput");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartBadge = document.getElementById("cartBadge");
const cartItemsContainer = document.getElementById("cartItems");

const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDeliveryEl = document.getElementById("cartDelivery");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const toastEl = document.getElementById("toast");

// ================= RENDER MENU =================
function renderMenu() {
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filteredItems.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-search">
        <p>No dishes matched "<strong>${searchQuery}</strong>". Try another keyword or category!</p>
      </div>
    `;
    return;
  }

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
      <article class="food-card">
        <div class="food-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="food-body">
          <h3 class="food-title">${item.name}</h3>
          <p class="food-desc">${item.description}</p>
          <div class="food-footer">
            <span class="food-price">$${item.price.toFixed(2)}</span>
            <button class="btn btn-primary add-btn" onclick="addToCart(${item.id})">
              <i class="fa-solid fa-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

// ================= CART OPERATIONS =================
function addToCart(id) {
  const product = menuItems.find((item) => item.id === id);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`Added "${product.name}" to your cart!`);
}

function updateQuantity(id, delta) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;

  // Remove item if quantity drops to 0
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  updateCartUI();
}

function updateCartUI() {
  // 1. Update Badge Counter
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalCount;

  // 2. Render Cart Drawer Items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Your cart is empty.<br/>Add some tasty dishes from the menu!</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  // 3. Calculate Subtotal, Delivery Fee & Grand Total
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const grandTotal = subtotal + delivery;

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartDeliveryEl.textContent = `$${delivery.toFixed(2)}`;
  cartTotalEl.textContent = `$${grandTotal.toFixed(2)}`;

  // Enable/Disable Checkout Button
  checkoutBtn.disabled = cart.length === 0;
}

// ================= DRAWER & MODAL CONTROLS =================
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

let toastTimeout;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2600);
}

// ================= EVENT LISTENERS =================
// Category Filtering
filterBar.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;

  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  activeCategory = e.target.dataset.category;
  renderMenu();
});

// Live Search Input
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderMenu();
});

// Cart Drawer Open/Close
openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Mobile Navigation Toggle
mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

// Checkout Action
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  const totalPaid = cartTotalEl.textContent;
  alert(`Order Confirmed!\n\nThank you for ordering with CraveBite.\nTotal Charged: ${totalPaid}\nEstimated Delivery: 25–35 minutes.`);

  // Reset cart state after checkout
  cart = [];
  updateCartUI();
  closeCart();
});

// ================= INITIALIZE APP =================
renderMenu();
updateCartUI();