import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const productSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("tents", productSource, element);

productList.init();