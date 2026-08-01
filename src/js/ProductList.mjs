import { renderListWithTemplate, displayQuickView } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
            <a href="/product_pages/?product=${product.Id}">
              <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}"/>
              <h3 class="card__brand">${product.Brand.Name}</h3>
              <h2 class="card__name">${product.Name}</h2>
              <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
            <button class="modal-btn">Quick View</button>
          </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
        document.querySelector(".title").textContent = this.category;
        const myDialog = document.querySelector("#mydialog");
        const close = document.querySelector("#mydialog button");
        close.addEventListener("click", () => myDialog.close());
    }
    renderList(list) {
        // const htmlStrings = list.map(productCardTemplate)
        // this.listElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''));

        // apply use new utility function instead of the commented code above
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", false, 
            (items) => {
                this.listElement.querySelectorAll(".modal-btn").forEach((btn, index) => {
                    btn.addEventListener("click", () => {
                        displayQuickView(items[index])
                    });                  
                });
            }
        );
    }
}