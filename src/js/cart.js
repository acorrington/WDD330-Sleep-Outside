import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  const cartTotalElement = document.querySelector("#cart-total");

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      `<li class="cart-empty-message">Your cart is empty. <a href="/index.html">Continue shopping</a></li>`;
    if (cartTotalElement) {
      cartTotalElement.textContent = "";
    }
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  renderCartTotal(cartItems);

  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemId = button.dataset.id;
      let cartItems = getLocalStorage("so-cart");
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

function renderCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  const cartTotalElement = document.querySelector("#cart-total");
  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
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