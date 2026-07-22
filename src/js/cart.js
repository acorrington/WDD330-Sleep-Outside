import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  const cartFooter = document.querySelector(".cart-footer");

  // if the cart is empty, show a friendly message instead of a blank page
  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      `<li class="cart-empty-message">Your cart is empty. <a href="/index.html">Continue shopping</a></li>`;
    if (cartFooter) {
      cartFooter.classList.add("hide");
    }
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

  if (cartFooter) {
    document.querySelector(".cart-total").innerHTML =
      `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  }

  // Add event listeners to the remove buttons
  const removeButtons = document.querySelectorAll(".remove-item");
  // Add event listeners to the remove buttons
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Get the item ID from the button's data attribute
      const itemId = button.dataset.id;
      // Remove the item from the cart
      cartItems = getLocalStorage("so-cart");
      if (Array.isArray(cartItems)) {
        cartItems = cartItems.filter((item) => item.Id !== itemId);
        localStorage.setItem("so-cart", JSON.stringify(cartItems));
      } else if (cartItems && cartItems.Id === itemId) {
        localStorage.removeItem("so-cart");
      }
      // Re-render the cart
      renderCartContents();
    });
  });
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <p class="cart-card__remove">
    <a href="#" class="remove-item" data-id="${item.Id}"><span style="color: red;">&#10006;</span></a>
  </p>
</li>`;

  return newItem;
}

renderCartContents();
