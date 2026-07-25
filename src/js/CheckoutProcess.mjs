import { getLocalStorage } from "./utils.mjs";

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
        // shipping is $10 for the first item plus $2 for each additional item. 
        this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
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

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateOrderTotal();
        this.displayOrderTotals();
    }
}