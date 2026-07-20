import { qs, getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        qs("#addToCart").addEventListener(
            "click",
            this.addToCart.bind(this)
        );
    }

    addToCart() {
        let cartItems = getLocalStorage("so-cart");
        if (!Array.isArray(cartItems)) {
            cartItems = cartItems ? [cartItems] : [];
        }
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        qs("#productName").textContent = this.product.NameWithoutBrand;
        qs("#productBrand").textContent = this.product.Brand.Name;

        const productImage = qs("#productImage");
        productImage.src = this.product.Images.PrimaryLarge;
        productImage.alt = this.product.NameWithoutBrand;

        qs("#productPrice").textContent = this.product.FinalPrice;
        qs("#productColor").textContent = this.product.Colors[0].ColorName;
        qs("#productDescription").innerHTML = this.product.DescriptionHtmlSimple;

        qs("#addToCart").dataset.id = this.product.Id;
        this.renderDiscount();

    }

    renderDiscount() {
        const discountElement = qs("#productDiscount");
        const { FinalPrice, SuggestedRetailPrice } = this.product;

        if (FinalPrice < SuggestedRetailPrice) {
            const amountOff = (SuggestedRetailPrice - FinalPrice).toFixed(2);
            const percentOff = Math.round(
                ((SuggestedRetailPrice - FinalPrice) / SuggestedRetailPrice) * 100
            );
            discountElement.textContent = `Save $${amountOff} (${percentOff}% off)`;
            discountElement.hidden = false;
        } else {
            discountElement.hidden = true;
        }

    }
}

