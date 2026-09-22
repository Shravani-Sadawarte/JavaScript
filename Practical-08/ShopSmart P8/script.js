// script.js

/* ============================================================
   PRODUCT DATA
============================================================ */
const products = [
  { id: 1, name: "Oversized Cotton T-Shirt", brand: "Urban Threads", category: "T-Shirts", gender: "Men", price: 799, originalPrice: 1499, discount: 47, rating: 4.5, ratingCount: 2312, size: ["S","M","L","XL"], color: "Black", stock: true, badge: "BESTSELLER", image: "assets/products/oversized-tshirt.jpg", icon: "👕" },
  { id: 2, name: "Slim Fit Formal Shirt", brand: "Vantage", category: "Shirts", gender: "Men", price: 999, originalPrice: 1799, discount: 44, rating: 4.2, ratingCount: 1120, size: ["S","M","L","XL"], color: "White", stock: true, badge: "", image: "assets/products/slim-fit-shirt.jpg", icon: "👔" },
  { id: 3, name: "Classic Denim Jacket", brand: "Roadster", category: "Jackets", gender: "Men", price: 1999, originalPrice: 3499, discount: 43, rating: 4.4, ratingCount: 875, size: ["M","L","XL"], color: "Blue", stock: false, badge: "", image: "assets/products/denim-jacket.jpg", icon: "🧥" },
  { id: 4, name: "Fleece Casual Hoodie", brand: "HighStreet", category: "Hoodies", gender: "Men", price: 1299, originalPrice: 2199, discount: 41, rating: 4.1, ratingCount: 640, size: ["S","M","L","XL"], color: "Grey", stock: true, badge: "NEW", image: "assets/products/casual-hoodie.jpg", icon: "🧥" },
  { id: 5, name: "Floral Wrap Dress", brand: "Zink London", category: "Dresses", gender: "Women", price: 1399, originalPrice: 2799, discount: 50, rating: 4.6, ratingCount: 1980, size: ["XS","S","M","L"], color: "Pink", stock: true, badge: "BESTSELLER", image: "assets/products/floral-dress.jpg", icon: "👗" },
  { id: 6, name: "Embroidered Anarkali Kurta", brand: "Libas", category: "Kurtas", gender: "Women", price: 1199, originalPrice: 2399, discount: 50, rating: 4.3, ratingCount: 1560, size: ["S","M","L","XL"], color: "Maroon", stock: true, badge: "", image: "assets/products/womens-kurta.jpg", icon: "👘" },
  { id: 7, name: "Wide Leg High-Rise Jeans", brand: "Only", category: "Jeans", gender: "Women", price: 1599, originalPrice: 2999, discount: 47, rating: 4.0, ratingCount: 730, size: ["XS","S","M","L"], color: "Light Blue", stock: true, badge: "NEW", image: "assets/products/wide-leg-jeans.jpg", icon: "👖" },
  { id: 8, name: "Lightweight Running Shoes", brand: "Sprintz", category: "Footwear", gender: "Men", price: 2199, originalPrice: 3999, discount: 45, rating: 4.5, ratingCount: 2870, size: ["S","M","L","XL"], color: "White", stock: true, badge: "BESTSELLER", image: "assets/products/running-shoes.jpg", icon: "👟" },
  { id: 9, name: "Casual Canvas Sneakers", brand: "Bewakoof", category: "Footwear", gender: "Unisex", price: 999, originalPrice: 1799, discount: 44, rating: 4.1, ratingCount: 990, size: ["S","M","L","XL"], color: "Beige", stock: true, badge: "", image: "assets/products/casual-sneakers.jpg", icon: "👟" },
  { id: 10, name: "Block Heel Sandals", brand: "Catwalk", category: "Footwear", gender: "Women", price: 1499, originalPrice: 2599, discount: 42, rating: 4.2, ratingCount: 610, size: ["S","M","L"], color: "Tan", stock: true, badge: "", image: "assets/products/heels.jpg", icon: "👠" },
  { id: 11, name: "Structured Tote Handbag", brand: "Caprese", category: "Bags", gender: "Women", price: 1799, originalPrice: 3199, discount: 44, rating: 4.4, ratingCount: 845, size: [], color: "Brown", stock: true, badge: "NEW", image: "assets/products/handbag.jpg", icon: "👜" },
  { id: 12, name: "Classic Aviator Sunglasses", brand: "Fastrack", category: "Accessories", gender: "Unisex", price: 899, originalPrice: 1499, discount: 40, rating: 4.3, ratingCount: 1330, size: [], color: "Gold", stock: true, badge: "", image: "assets/products/classic-sunglasses.jpg", icon: "🕶️" },
  { id: 13, name: "Chronograph Analog Watch", brand: "Titan", category: "Accessories", gender: "Men", price: 2999, originalPrice: 4999, discount: 40, rating: 4.6, ratingCount: 2040, size: [], color: "Black", stock: true, badge: "BESTSELLER", image: "assets/products/analog-watch.jpg", icon: "⌚" },
  { id: 14, name: "Genuine Leather Wallet", brand: "Woodland", category: "Accessories", gender: "Men", price: 699, originalPrice: 1299, discount: 46, rating: 4.2, ratingCount: 560, size: [], color: "Brown", stock: true, badge: "", image: "assets/products/leather-wallet.jpg", icon: "👛" },
  { id: 15, name: "Matte Liquid Lipstick", brand: "Sugar", category: "Beauty", gender: "Women", price: 449, originalPrice: 699, discount: 36, rating: 4.4, ratingCount: 3200, size: [], color: "Red", stock: true, badge: "NEW", image: "assets/products/lipstick.jpg", icon: "💄" },
  { id: 16, name: "Vitamin C Face Serum", brand: "Minimalist", category: "Beauty", gender: "Unisex", price: 599, originalPrice: 899, discount: 33, rating: 4.5, ratingCount: 4100, size: [], color: "-", stock: true, badge: "BESTSELLER", image: "assets/products/face-serum.jpg", icon: "🧴" },
  { id: 17, name: "Printed Cotton T-Shirt", brand: "Kids Zone", category: "T-Shirts", gender: "Kids", price: 399, originalPrice: 699, discount: 43, rating: 4.1, ratingCount: 410, size: ["S","M","L"], color: "Yellow", stock: true, badge: "", image: "assets/products/kids-tshirt.jpg", icon: "👕" },
  { id: 18, name: "Velcro Sports Sneakers", brand: "Kids Zone", category: "Footwear", gender: "Kids", price: 799, originalPrice: 1299, discount: 38, rating: 4.3, ratingCount: 355, size: ["S","M","L"], color: "Blue", stock: true, badge: "NEW", image: "assets/products/kids-sneakers.jpg", icon: "👟" },
  { id: 19, name: "Cotton Double Bedsheet Set", brand: "Spaces", category: "Home", gender: "Unisex", price: 1099, originalPrice: 1999, discount: 45, rating: 4.2, ratingCount: 780, size: [], color: "Blue", stock: true, badge: "", image: "assets/products/bedsheet-set.jpg", icon: "🛏️" },
  { id: 20, name: "Cushion Cover Set of 5", brand: "Spaces", category: "Home", gender: "Unisex", price: 699, originalPrice: 1299, discount: 46, rating: 4.0, ratingCount: 520, size: [], color: "Multicolor", stock: true, badge: "SALE", image: "assets/products/cushion-cover.jpg", icon: "🛋️" }
];

const DELIVERY_CHARGE = 79;

/* ============================================================
   STATE
============================================================ */
let wishlist = JSON.parse(localStorage.getItem("styleHubWishlist") || "[]");
let bag = JSON.parse(localStorage.getItem("styleHubBag") || "[]");
let currentOrder = null;
let activeProductForDetails = null;
let selectedSizeInModal = null;

/* ============================================================
   DOM REFERENCES
============================================================ */
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchError = document.getElementById("searchError");

const genderRadios = document.querySelectorAll('input[name="genderFilter"]');
const categoryCheckboxesWrap = document.getElementById("categoryCheckboxes");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const discountFilter = document.getElementById("discountFilter");
const ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
const sizeCheckboxes = document.querySelectorAll('#sizeCheckboxes input[type="checkbox"]');
const sortFilter = document.getElementById("sortFilter");

const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const noResultsClearBtn = document.getElementById("noResultsClearBtn");

const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const resultCount = document.getElementById("resultCount");

const filterSidebar = document.getElementById("filterSidebar");
const openFilterBtn = document.getElementById("openFilterBtn");
const closeFilterBtn = document.getElementById("closeFilterBtn");

const overlay = document.getElementById("overlay");

const wishlistBtn = document.getElementById("wishlistBtn");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const closeWishlistBtn = document.getElementById("closeWishlistBtn");
const wishlistItemsEl = document.getElementById("wishlistItems");
const wishlistCountEl = document.getElementById("wishlistCount");

const bagBtn = document.getElementById("bagBtn");
const bagDrawer = document.getElementById("bagDrawer");
const closeBagBtn = document.getElementById("closeBagBtn");
const bagItemsEl = document.getElementById("bagItems");
const bagCountEl = document.getElementById("bagCount");
const bagSubtotalEl = document.getElementById("bagSubtotal");
const bagDiscountEl = document.getElementById("bagDiscount");
const bagDeliveryEl = document.getElementById("bagDelivery");
const bagTotalEl = document.getElementById("bagTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");

const detailsModal = document.getElementById("detailsModal");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const detailsBody = document.getElementById("detailsBody");

const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const checkoutItemsEl = document.getElementById("checkoutItems");
const checkoutSubtotalEl = document.getElementById("checkoutSubtotal");
const checkoutDiscountEl = document.getElementById("checkoutDiscount");
const checkoutDeliveryEl = document.getElementById("checkoutDelivery");
const checkoutTotalEl = document.getElementById("checkoutTotal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const cardDemoNote = document.getElementById("cardDemoNote");

const confirmationModal = document.getElementById("confirmationModal");
const confirmOrderIdEl = document.getElementById("confirmOrderId");
const viewReceiptBtn = document.getElementById("viewReceiptBtn");
const closeConfirmBtn = document.getElementById("closeConfirmBtn");

const receiptModal = document.getElementById("receiptModal");
const closeReceiptBtn = document.getElementById("closeReceiptBtn");
const receiptBody = document.getElementById("receiptBody");

const toast = document.getElementById("toast");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

/* ============================================================
   INIT CATEGORY CHECKBOXES (built dynamically from data)
============================================================ */
function initCategoryCheckboxes() {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categoryCheckboxesWrap.innerHTML = categories.map((cat) => `
    <label><input type="checkbox" value="${cat}" class="category-checkbox"> ${cat}</label>
  `).join("");

  categoryCheckboxesWrap.querySelectorAll(".category-checkbox").forEach((cb) => {
    cb.addEventListener("change", filterProducts);
  });
}

/* ============================================================
   VALIDATION
============================================================ */
function validateSearch(value) {
  if (value.trim() === "") {
    searchError.textContent = "";
    searchInput.classList.remove("invalid");
    return true;
  }

  const validPattern = /^[A-Za-z\s]*$/;

  if (!validPattern.test(value)) {
    searchError.textContent = "Only letters and spaces are allowed in search.";
    searchInput.classList.add("invalid");
    return false;
  }

  searchError.textContent = "";
  searchInput.classList.remove("invalid");
  return true;
}

/* ============================================================
   FILTER + SORT
============================================================ */
function getSelectedCategories() {
  return [...categoryCheckboxesWrap.querySelectorAll(".category-checkbox:checked")].map((cb) => cb.value);
}

function getSelectedSizes() {
  return [...sizeCheckboxes].filter((cb) => cb.checked).map((cb) => cb.value);
}

function filterProducts() {
  const rawSearch = searchInput.value;
  const isValid = validateSearch(rawSearch);
  const searchText = rawSearch.trim().toLowerCase().replace(/\s+/g, " ");

  const gender = document.querySelector('input[name="genderFilter"]:checked').value;
  const selectedCategories = getSelectedCategories();
  const minPrice = minPriceInput.value !== "" ? Number(minPriceInput.value) : 0;
  const maxPrice = maxPriceInput.value !== "" ? Number(maxPriceInput.value) : Infinity;
  const minDiscount = Number(discountFilter.value);
  const minRating = Number(document.querySelector('input[name="ratingFilter"]:checked').value);
  const selectedSizes = getSelectedSizes();

  let result = products.filter((product) => {
    const matchesSearch = isValid
      ? (product.name.toLowerCase().includes(searchText) ||
         product.brand.toLowerCase().includes(searchText) ||
         product.category.toLowerCase().includes(searchText))
      : true;

    const matchesGender = gender === "all" || product.gender === gender || product.gender === "Unisex";
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesDiscount = product.discount >= minDiscount;
    const matchesRating = product.rating >= minRating;
    const matchesSize = selectedSizes.length === 0 || product.size.some((s) => selectedSizes.includes(s));

    return matchesSearch && matchesGender && matchesCategory && matchesPrice && matchesDiscount && matchesRating && matchesSize;
  });

  result = sortProducts(result, sortFilter.value);

  renderProducts(result);
  updateProductCount(result.length, products.length);
}

function sortProducts(list, sortType) {
  const sorted = [...list];

  switch (sortType) {
    case "priceLowHigh":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "ratingHighLow":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "discountHighLow":
      sorted.sort((a, b) => b.discount - a.discount);
      break;
    default:
      sorted.sort((a, b) => a.id - b.id);
  }

  return sorted;
}

/* ============================================================
   IMAGE HELPER
============================================================ */
function productImageHTML(product) {
  return `
    <img src="${product.image}" alt="${product.name}" loading="lazy"
      onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'), { className: 'image-fallback', textContent: '${product.icon}' }));">
  `;
}

/* ============================================================
   RENDER PRODUCT GRID
============================================================ */
function renderProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.hidden = true;
    noResults.hidden = false;
    return;
  }

  productGrid.hidden = false;
  noResults.hidden = true;

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = product.id;

    const isWishlisted = wishlist.includes(product.id);

    card.innerHTML = `
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      <button class="wishlist-heart ${isWishlisted ? "active" : ""}" data-id="${product.id}" title="Toggle Wishlist">
        ${isWishlisted ? "❤️" : "♡"}
      </button>
      <div class="product-image-wrap">
        ${productImageHTML(product)}
        <div class="quick-add-overlay">ADD TO BAG</div>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating"><span class="rating-pill">${product.rating.toFixed(1)} ★</span> (${product.ratingCount})</div>
        <div class="price-row">
          <span class="current-price">₹${product.price.toLocaleString("en-IN")}</span>
          <span class="original-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>
          <span class="discount-text">${product.discount}% OFF</span>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function updateProductCount(shown, total) {
  resultCount.textContent = `${shown} of ${total} items found`;
}

/* ============================================================
   WISHLIST
============================================================ */
function saveWishlist() {
  localStorage.setItem("styleHubWishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const index = wishlist.indexOf(productId);

  if (index === -1) {
    wishlist.push(productId);
    showToast(`♡ ${product.name} added to wishlist`);
  } else {
    wishlist.splice(index, 1);
    showToast(`✓ ${product.name} removed from wishlist`);
  }

  saveWishlist();
  wishlistCountEl.textContent = wishlist.length;
  renderWishlist();
  filterProducts();
}

function renderWishlist() {
  wishlistItemsEl.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItemsEl.innerHTML = `<p class="empty-state">Your wishlist is empty.<br>Tap ♡ on any product to save it here.</p>`;
    return;
  }

  wishlist.forEach((id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "side-item";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}"
        onerror="this.onerror=null; this.outerHTML='<div class=\\'side-item-fallback\\'>${product.icon}</div>';">
      <div class="side-item-info">
        <div class="side-item-brand">${product.brand}</div>
        <div class="side-item-name">${product.name}</div>
        <div class="side-item-price">₹${product.price.toLocaleString("en-IN")}</div>
      </div>
      <div class="side-item-buttons">
        <button class="move-btn" data-id="${product.id}" title="Move to bag">Move to Bag</button>
        <button class="remove-btn" data-id="${product.id}" title="Remove from wishlist">Remove</button>
      </div>
    `;
    wishlistItemsEl.appendChild(row);
  });
}

/* ============================================================
   BAG
============================================================ */
function saveBag() {
  localStorage.setItem("styleHubBag", JSON.stringify(bag));
}

function addToBag(productId, size) {
  const product = products.find((p) => p.id === productId);
  if (!product || !product.stock) return;

  const chosenSize = size || (product.size.length ? product.size[0] : "-");
  const existing = bag.find((item) => item.id === productId && item.size === chosenSize);

  if (existing) {
    existing.qty += 1;
  } else {
    bag.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      icon: product.icon,
      size: chosenSize,
      qty: 1
    });
  }

  saveBag();
  updateBag();
  showToast(`✓ ${product.name} added to bag`);
}

function removeFromBag(productId, size) {
  const item = bag.find((i) => i.id === productId && i.size === size);
  bag = bag.filter((i) => !(i.id === productId && i.size === size));
  saveBag();
  updateBag();
  if (item) showToast(`✓ ${item.name} removed from bag`);
}

function moveBagItemToWishlist(productId, size) {
  const item = bag.find((i) => i.id === productId && i.size === size);
  if (!item) return;

  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveWishlist();
    wishlistCountEl.textContent = wishlist.length;
    renderWishlist();
  }

  removeFromBag(productId, size);
  filterProducts();
}

function moveWishlistItemToBag(productId) {
  addToBag(productId);
  wishlist = wishlist.filter((id) => id !== productId);
  saveWishlist();
  wishlistCountEl.textContent = wishlist.length;
  renderWishlist();
  filterProducts();
}

function changeBagQuantity(productId, size, delta) {
  const item = bag.find((i) => i.id === productId && i.size === size);
  if (!item) return;

  item.qty += delta;
  if (item.qty < 1) item.qty = 1;

  saveBag();
  updateBag();
}

function bagSubtotal() {
  return bag.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function bagDiscountTotal() {
  return bag.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.qty, 0);
}

function updateBag() {
  const totalItems = bag.reduce((sum, item) => sum + item.qty, 0);
  bagCountEl.textContent = totalItems;
  renderBag();
  updateTotals();
}

function renderBag() {
  bagItemsEl.innerHTML = "";

  if (bag.length === 0) {
    bagItemsEl.innerHTML = `<p class="empty-state">Your bag is empty.<br>Add some products to get started!</p>`;
    return;
  }

  bag.forEach((item) => {
    const row = document.createElement("div");
    row.className = "side-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}"
        onerror="this.onerror=null; this.outerHTML='<div class=\\'side-item-fallback\\'>${item.icon}</div>';">
      <div class="side-item-info">
        <div class="side-item-brand">${item.brand}</div>
        <div class="side-item-name">${item.name}</div>
        <div class="side-item-meta">Size: ${item.size}</div>
        <div class="side-item-price">₹${item.price.toLocaleString("en-IN")}</div>
        <div class="qty-controls">
          <button class="qty-btn minus-btn" data-id="${item.id}" data-size="${item.size}" title="Decrease">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn plus-btn" data-id="${item.id}" data-size="${item.size}" title="Increase">+</button>
        </div>
      </div>
      <div class="side-item-buttons">
        <button class="move-btn" data-id="${item.id}" data-size="${item.size}" title="Move to wishlist">Wishlist</button>
        <button class="remove-btn" data-id="${item.id}" data-size="${item.size}" title="Remove">Remove</button>
      </div>
    `;
    bagItemsEl.appendChild(row);
  });
}

function updateTotals() {
  const subtotal = bagSubtotal();
  const discount = bagDiscountTotal();
  const delivery = bag.length > 0 ? DELIVERY_CHARGE : 0;
  const total = subtotal + delivery;

  bagSubtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  bagDiscountEl.textContent = `−₹${discount.toLocaleString("en-IN")}`;
  bagDeliveryEl.textContent = delivery === 0 ? "₹0" : `₹${delivery}`;
  bagTotalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
}

/* ============================================================
   PRODUCT DETAILS MODAL
============================================================ */
function openProductDetails(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  activeProductForDetails = product;
  selectedSizeInModal = product.size.length ? product.size[0] : null;

  renderDetailsModal();

  overlay.classList.add("show");
  detailsModal.classList.add("open");
}

function renderDetailsModal() {
  const product = activeProductForDetails;
  const isWishlisted = wishlist.includes(product.id);

  const sizeRow = product.size.length ? `
    <div class="size-select-row" id="sizeSelectRow">
      ${product.size.map((s) => `<div class="size-option ${s === selectedSizeInModal ? "selected" : ""}" data-size="${s}">${s}</div>`).join("")}
    </div>
  ` : "";

  detailsBody.innerHTML = `
    <div class="details-grid">
      <div class="details-image">${productImageHTML(product)}</div>
      <div>
        <div class="details-brand">${product.brand}</div>
        <div class="details-name">${product.name}</div>
        <div class="product-rating"><span class="rating-pill">${product.rating.toFixed(1)} ★</span> (${product.ratingCount} ratings)</div>
        <div class="details-price-row price-row">
          <span class="current-price">₹${product.price.toLocaleString("en-IN")}</span>
          <span class="original-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>
          <span class="discount-text">${product.discount}% OFF</span>
        </div>
        <p class="details-desc">Color: ${product.color}. Crafted for everyday comfort with a modern fit — a versatile piece from ${product.brand}'s latest collection.</p>
        <p class="details-delivery">🚚 Free delivery in 3–5 business days</p>
        ${sizeRow}
        <div class="details-actions">
          <button class="add-to-bag-btn" id="detailsAddToBagBtn" ${!product.stock ? "disabled" : ""}>
            ${product.stock ? "ADD TO BAG" : "OUT OF STOCK"}
          </button>
          <button class="wishlist-btn-outline ${isWishlisted ? "active" : ""}" id="detailsWishlistBtn">
            ${isWishlisted ? "❤️ WISHLISTED" : "♡ WISHLIST"}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   SIDEBAR / OVERLAY CONTROLS
============================================================ */
function openPanel(panel) {
  overlay.classList.add("show");
  panel.classList.add("open");
}

function closeAllPanels() {
  wishlistDrawer.classList.remove("open");
  bagDrawer.classList.remove("open");
  filterSidebar.classList.remove("open");
  detailsModal.classList.remove("open");
  checkoutModal.classList.remove("open");
  confirmationModal.classList.remove("open");
  receiptModal.classList.remove("open");
  overlay.classList.remove("show");
}

/* ============================================================
   CHECKOUT / ORDER
============================================================ */
function openCheckout() {
  if (bag.length === 0) {
    showToast("Your bag is empty");
    return;
  }

  checkoutItemsEl.innerHTML = bag.map((item) => `
    <div class="checkout-item-row">
      <span>${item.name} (${item.size}) × ${item.qty}</span>
      <span>₹${(item.price * item.qty).toLocaleString("en-IN")}</span>
    </div>
  `).join("");

  const subtotal = bagSubtotal();
  const discount = bagDiscountTotal();
  const total = subtotal + DELIVERY_CHARGE;

  checkoutSubtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  checkoutDiscountEl.textContent = `−₹${discount.toLocaleString("en-IN")}`;
  checkoutDeliveryEl.textContent = `₹${DELIVERY_CHARGE}`;
  checkoutTotalEl.textContent = `₹${total.toLocaleString("en-IN")}`;

  bagDrawer.classList.remove("open");
  overlay.classList.add("show");
  checkoutModal.classList.add("open");
}

function generateOrderId() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SH-${rand}`;
}

function placeOrder() {
  const name = document.getElementById("addrName").value.trim();
  const phone = document.getElementById("addrPhone").value.trim();
  const address = document.getElementById("addrLine").value.trim();

  if (!name || !phone || !address) {
    showToast("Please fill in your delivery address");
    return;
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const subtotal = bagSubtotal();
  const discount = bagDiscountTotal();
  const total = subtotal + DELIVERY_CHARGE;

  currentOrder = {
    id: generateOrderId(),
    date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
    items: bag.map((item) => ({ ...item })),
    subtotal,
    discount,
    delivery: DELIVERY_CHARGE,
    total,
    paymentMethod
  };

  bag = [];
  saveBag();
  updateBag();

  checkoutModal.classList.remove("open");
  confirmOrderIdEl.textContent = currentOrder.id;
  confirmationModal.classList.add("open");
  showToast("✓ Order placed successfully");
}

function generateReceipt() {
  if (!currentOrder) return;

  const itemsHTML = currentOrder.items.map((item) => `
    <div class="receipt-row">
      <span>${item.name} (${item.size}) × ${item.qty}</span>
      <span>₹${(item.price * item.qty).toLocaleString("en-IN")}</span>
    </div>
  `).join("");

  receiptBody.innerHTML = `
    <div class="receipt-title">STYLEHUB</div>
    <div class="receipt-sub">ORDER RECEIPT</div>
    <div class="receipt-row"><span>Order ID</span><span>${currentOrder.id}</span></div>
    <div class="receipt-row"><span>Date</span><span>${currentOrder.date}</span></div>
    <hr>
    ${itemsHTML}
    <hr>
    <div class="receipt-row"><span>Subtotal</span><span>₹${currentOrder.subtotal.toLocaleString("en-IN")}</span></div>
    <div class="receipt-row"><span>Discount</span><span>−₹${currentOrder.discount.toLocaleString("en-IN")}</span></div>
    <div class="receipt-row"><span>Delivery</span><span>₹${currentOrder.delivery}</span></div>
    <div class="receipt-row receipt-total"><span>TOTAL</span><span>₹${currentOrder.total.toLocaleString("en-IN")}</span></div>
    <div class="receipt-row"><span>Payment</span><span>${currentOrder.paymentMethod}</span></div>
    <div class="receipt-thanks">Thank you for shopping with StyleHub.</div>
  `;

  confirmationModal.classList.remove("open");
  receiptModal.classList.add("open");
}

/* ============================================================
   TOAST
============================================================ */
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ============================================================
   CLEAR FILTERS
============================================================ */
function clearFilters() {
  searchInput.value = "";
  document.querySelector('input[name="genderFilter"][value="all"]').checked = true;
  categoryCheckboxesWrap.querySelectorAll(".category-checkbox").forEach((cb) => (cb.checked = false));
  minPriceInput.value = "";
  maxPriceInput.value = "";
  discountFilter.value = "0";
  document.querySelector('input[name="ratingFilter"][value="0"]').checked = true;
  sizeCheckboxes.forEach((cb) => (cb.checked = false));
  sortFilter.value = "recommended";
  searchError.textContent = "";
  searchInput.classList.remove("invalid");

  filterProducts();
  showToast("Filters cleared");
}

/* ============================================================
   EVENT LISTENERS
============================================================ */

// input: search validation + live filter
searchInput.addEventListener("input", filterProducts);

// submit: search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filterProducts();
});

// change: filter controls
genderRadios.forEach((r) => r.addEventListener("change", filterProducts));
minPriceInput.addEventListener("change", filterProducts);
maxPriceInput.addEventListener("change", filterProducts);
discountFilter.addEventListener("change", filterProducts);
ratingRadios.forEach((r) => r.addEventListener("change", filterProducts));
sizeCheckboxes.forEach((cb) => cb.addEventListener("change", filterProducts));
sortFilter.addEventListener("change", filterProducts);

// click: apply / clear filters
applyFiltersBtn.addEventListener("click", () => {
  filterProducts();
  if (window.innerWidth <= 992) {
    filterSidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
});
clearFiltersBtn.addEventListener("click", clearFilters);
noResultsClearBtn.addEventListener("click", clearFilters);

// click: mobile filter drawer
openFilterBtn.addEventListener("click", () => openPanel(filterSidebar));
closeFilterBtn.addEventListener("click", () => {
  filterSidebar.classList.remove("open");
  overlay.classList.remove("show");
});

// click: hamburger nav toggle (mobile)
hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("mobile-open");
});

// click: category strip + nav links (gender/category quick filters)
document.getElementById("categoryStrip").addEventListener("click", (e) => {
  const chip = e.target.closest(".cat-chip");
  if (!chip) return;
  applyQuickFilter(chip);
});

document.getElementById("navLinks").addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;
  e.preventDefault();
  applyQuickFilter(link);
});

document.querySelectorAll(".hero-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyQuickFilter(btn));
});

function applyQuickFilter(el) {
  const gender = el.dataset.gender;
  const category = el.dataset.category;

  if (gender) {
    document.querySelector(`input[name="genderFilter"][value="${gender}"]`).checked = true;
  } else {
    document.querySelector('input[name="genderFilter"][value="all"]').checked = true;
  }

  categoryCheckboxesWrap.querySelectorAll(".category-checkbox").forEach((cb) => {
    cb.checked = category && category !== "all" && cb.value === category;
  });

  filterProducts();
  window.scrollTo({ top: document.querySelector(".main-layout").offsetTop - 90, behavior: "smooth" });
}

// click (delegated): wishlist heart + card click on product grid
productGrid.addEventListener("click", (e) => {
  const heartBtn = e.target.closest(".wishlist-heart");
  if (heartBtn) {
    e.stopPropagation();
    toggleWishlist(Number(heartBtn.dataset.id));
    return;
  }

  const card = e.target.closest(".product-card");
  if (card) {
    openProductDetails(Number(card.dataset.id));
  }
});

// click: wishlist / bag icon buttons in navbar
wishlistBtn.addEventListener("click", () => {
  renderWishlist();
  openPanel(wishlistDrawer);
});

bagBtn.addEventListener("click", () => {
  renderBag();
  openPanel(bagDrawer);
});

closeWishlistBtn.addEventListener("click", closeAllPanels);
closeBagBtn.addEventListener("click", closeAllPanels);
closeDetailsBtn.addEventListener("click", closeAllPanels);
closeCheckoutBtn.addEventListener("click", closeAllPanels);
closeConfirmBtn.addEventListener("click", closeAllPanels);
closeReceiptBtn.addEventListener("click", closeAllPanels);
overlay.addEventListener("click", closeAllPanels);

// click (delegated): wishlist drawer buttons
wishlistItemsEl.addEventListener("click", (e) => {
  const moveBtn = e.target.closest(".move-btn");
  if (moveBtn) {
    moveWishlistItemToBag(Number(moveBtn.dataset.id));
    return;
  }

  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    toggleWishlist(Number(removeBtn.dataset.id));
  }
});

// click (delegated): bag drawer buttons
bagItemsEl.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  const size = e.target.dataset.size;

  if (e.target.classList.contains("minus-btn")) {
    changeBagQuantity(id, size, -1);
  } else if (e.target.classList.contains("plus-btn")) {
    changeBagQuantity(id, size, 1);
  } else if (e.target.classList.contains("move-btn")) {
    moveBagItemToWishlist(id, size);
  } else if (e.target.classList.contains("remove-btn")) {
    removeFromBag(id, size);
  }
});

// click: place order (opens checkout from bag)
placeOrderBtn.addEventListener("click", openCheckout);

// click (delegated): product details modal (size select, add to bag, wishlist)
detailsBody.addEventListener("click", (e) => {
  const sizeOption = e.target.closest(".size-option");
  if (sizeOption) {
    selectedSizeInModal = sizeOption.dataset.size;
    renderDetailsModal();
    return;
  }

  if (e.target.id === "detailsAddToBagBtn") {
    if (activeProductForDetails.size.length && !selectedSizeInModal) {
      showToast("Please select a size");
      return;
    }
    addToBag(activeProductForDetails.id, selectedSizeInModal);
    closeAllPanels();
    return;
  }

  if (e.target.id === "detailsWishlistBtn") {
    toggleWishlist(activeProductForDetails.id);
    renderDetailsModal();
  }
});

// click: payment method toggle (show demo note for card)
document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    cardDemoNote.hidden = radio.closest(".modal-body").querySelector('input[value="Card"]').checked === false;
  });
});

// click: confirm order in checkout modal
confirmOrderBtn.addEventListener("click", placeOrder);

// click: view receipt / close confirmation
viewReceiptBtn.addEventListener("click", generateReceipt);

/* ============================================================
   INIT
============================================================ */
function init() {
  initCategoryCheckboxes();
  filterProducts();
  wishlistCountEl.textContent = wishlist.length;
  bagCountEl.textContent = bag.reduce((sum, item) => sum + item.qty, 0);
  renderWishlist();
  updateBag();
}

init();