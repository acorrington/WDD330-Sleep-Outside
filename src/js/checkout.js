import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
checkoutProcess.init();

const checkoutForm = document.querySelector("#checkout-form");
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkoutProcess.checkout(checkoutForm);
});
