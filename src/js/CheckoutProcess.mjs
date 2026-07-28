import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.quantity,
    }));
}

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateOrderTotal();
        this.displayOrderTotals();
    }

    calculateItemSubTotal() {
        // calculate and display the total dollar amount of the items in the cart, and the number of items.
        this.itemTotal = this.list.reduce((total, item) => {
            const unitPrice = Number(item.FinalPrice ?? 0);
            const quantity = Number(item.Quantity || 1);

            return total + unitPrice * quantity;
        }, 0);        
    }

    calculateOrderTotal() {
        // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
        this.tax = this.itemTotal * 0.06;
        const totalQuantity = this.list.reduce((total, item) => total + Number(item.Quantity || 1), 0);

        // shipping is $10 for the first item plus $2 for each additional item. 
        this.shipping = totalQuantity > 0 ? 10 + (totalQuantity - 1) * 2 : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        const cartTotalElement = document.querySelector(`${this.outputSelector} #cartTotal`);
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotalElement = document.querySelector(`${this.outputSelector} #orderTotal`);

        if (cartTotalElement) cartTotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout(form) {
        const formData = formDataToJSON(form);

        formData.orderDate = new Date().toISOString();
        formData.orderTotal = this.orderTotal.toFixed(2);
        formData.tax = this.tax.toFixed(2);
        formData.shipping = this.shipping;
        formData.items = packageItems(this.list);

        try {
            const response = await services.checkout(formData);

            localStorage.removeItem(this.key);
            window.location.href = "/checkout/success.html";

            return response;
        } catch (err) {
            if (err.name === "servicesError") {
                const detail =
                    err.message?.message || JSON.stringify(err.message);
                alertMessage(`Order failed: ${detail}`);
            } else {
                alertMessage("Something went wrong. Please try again.");
            }
            console.error("Checkout error:", err);
        }
    }
}
