import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1,
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
        const cartTotalElement = document.querySelector(
            `${this.outputSelector} #cartTotal`
        );

        this.itemTotal = this.list.reduce(
            (sum, item) => sum + item.FinalPrice,
            0
        );

        cartTotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrdertotal() {
        const itemCount = this.list.length;

        this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
        this.tax = this.itemTotal * 0.06;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const shippingElement = document.querySelector(
            `${this.outputSelector} #shipping`
        );
        const orderTotalElement = document.querySelector(
            `${this.outputSelector} #orderTotal`
        );

        taxElement.textContent = `$${this.tax.toFixed(2)}`;
        shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
        orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
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