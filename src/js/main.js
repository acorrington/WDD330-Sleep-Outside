import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");
const productList = new ProductList("tents");

console.log(productList, dataSource);
