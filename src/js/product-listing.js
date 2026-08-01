import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";

const displayCategory = category.replace("-", " ");
document.querySelector(".products h2").textContent =
  `Top Products: ${displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)}`;

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);
myList.init();
