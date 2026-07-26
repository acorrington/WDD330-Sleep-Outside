import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

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

    // takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
    packageItems(items) {
        // convert the list of products from localStorage to the simpler form required for the checkout process.
        // An Array.map would be perfect for this process.
        return items.map((item) => ({
            id: item.Id,
            name: item.NameWithoutBrand,
            price: item.FinalPrice,
            quantity: item.Quantity
        }));
    }

    async checkout(form) {
        const formData = this.formDataToJSON(form);
        console.log(`Form data: ${JSON.stringify(formData)}`);

        // convert the form data to a JSON order object using the formDataToJSON function
        const orderData = {
            fname: formData.fname,
            lname: formData.lname,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            cardNumber: formData.cardNumber,
            expiration: formData.expiration,
            code: formData.code,

            // adding the checkout-specific fields
            orderDate: new Date().toISOString(),
            orderTotal: "",
            tax: "",
            shipping: 0,
            items: []
        };

        // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
        const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
        checkoutProcess.init();
        orderData.orderTotal = checkoutProcess.orderTotal.toString();;
        orderData.tax = checkoutProcess.tax.toString();
        orderData.shipping = checkoutProcess.shipping;
        const cartItems = getLocalStorage("so-cart");
        orderData.items = this.packageItems(cartItems);

        // call the checkout method in the ExternalServices module and send it the JSON order data.
        const services = new ExternalServices();
        await services.checkout(orderData);
    }

    // takes a form element and returns an object where the key is the "name" of the form input.
    formDataToJSON(formElement) {
        const formData = new FormData(formElement),
            convertedJSON = {};

        formData.forEach(function (value, key) {
            convertedJSON[key] = value;
        });

        return convertedJSON;
    }
};

