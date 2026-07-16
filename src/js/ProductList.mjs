import { renderListWithTemplate } from "./utils.mjs";

// this function generates the HTML of a product card
// receives an object "product" with its properties (name, price, image, etc.) and returns a
// string of HTML for one <li> card

function productCardTemplate(product) {
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        ${isDiscounted ? '<span class="product-card__discount-flag">Sale</span>' : ""}
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        // const htmlStrings = list.map(productCardTemplate);
        // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

        // apply use new utility function instead of the commented code above
        renderListWithTemplate(productCardTemplate, this.listElement, list);

    }

}