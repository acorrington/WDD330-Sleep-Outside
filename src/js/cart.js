import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function normalizeCartItems(cartItems) {
  if (!Array.isArray(cartItems)) {
    return cartItems ? [cartItems] : [];
  }

  return cartItems;
}

function buildCartItemMarkup(item) {
  if (item) {

    console.log(item);

    const imageSrc = item.Images?.PrimaryMedium || "";
    const colorName = item.Colors?.[0]?.ColorName || "Unknown color";
    const quantity = Number(item.Quantity) || 1;
    const price = (Number(item.FinalPrice ?? 0) * quantity).toFixed(2);

    return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${imageSrc}"
          alt="${item.Name || "Product"}"
        />
      </a>
      <div class="cart-card__details">
        <a href="/product_pages/?product=${item.Id}">
          <h2 class="card__name">${item.Name || "Product"}</h2>
        </a>
        <p class="cart-card__color">${colorName}</p>
      </div>
      <div class="cart-card__controls">
        <p class="cart-card__quantity">qty:
        <input type="number" class="quantity-input" data-id="${item.Id}" value="${quantity}" min="1" />
        <span class="update-quantity" data-id="${item.Id}" title="Update Quantity">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </span>
        </p>
        <p class="cart-card__price">$${price}</p>
        <p class="cart-card__remove">
          <a href="#" class="remove-item" data-id="${item.Id}"><span style="color: red;">&#10006;</span></a>
        </p>
      </div>
    </li>`;
  }
}

function renderCartContents() {
  const cartItems = normalizeCartItems(getLocalStorage("so-cart"));
  const productList = document.querySelector(".product-list");
  const cartTotalElement = document.querySelector("#cart-total");
  const checkoutButton = document.querySelector("#checkout-button");

  if (!productList) return;

  if (cartItems.length === 0) {
    productList.innerHTML =
      `<li class="cart-empty-message">Your cart is empty. <a href="/index.html">Continue shopping</a></li>`;
    if (cartTotalElement) {
      cartTotalElement.textContent = "";
    }   
    if (checkoutButton) {
      console.log(checkoutButton.style.display);
      checkoutButton.style.display = cartItems.length > 0 ? "inline-block" : "none";
    }

    return;
  }

  productList.innerHTML = cartItems.map((item) => buildCartItemMarkup(item)).join("");
  bindCartEvents();
  renderCartTotal(cartItems);  
}

function renderCartTotal(cartItems) {
  let total = 0;

  cartItems.forEach((item) => {
    const unitPrice = Number(item.FinalPrice ?? 0);
    const lineTotal = unitPrice * Number(item.Quantity || 1);
    total += lineTotal;
  });

  const cartTotalElement = document.querySelector("#cart-total");
  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function bindCartEvents() {
  document.querySelectorAll(".update-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      const input = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
      const newQuantity = parseInt(input.value, 10);
      if (newQuantity >= 1) {
        console.log(`Updating item ${itemId} to quantity ${newQuantity}`);
        updateQuantity(itemId, newQuantity);
        renderCartContents();
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const itemId = button.dataset.id;
      let cartItems = normalizeCartItems(getLocalStorage("so-cart"));
      if (Array.isArray(cartItems)) {
        cartItems = cartItems.filter((item) => item.Id !== itemId);
        localStorage.setItem("so-cart", JSON.stringify(cartItems));
      } else if (cartItems && cartItems.Id === itemId) {
        localStorage.removeItem("so-cart");
      }
      renderCartContents();
    });
  });
}

function updateQuantity(itemId, newQuantity) {
  let cartItems = normalizeCartItems(getLocalStorage("so-cart"));
  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

  if (itemIndex !== -1) {
    const unitPrice = Number(cartItems[itemIndex].FinalPrice ?? 0);

    cartItems[itemIndex].Quantity = newQuantity;
    localStorage.setItem("so-cart", JSON.stringify(cartItems));
  }
}

renderCartContents();
