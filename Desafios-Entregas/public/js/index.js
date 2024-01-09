const socket = io();

socket.on("updateProducts", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; 

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${product.title}</strong> - ${product.description} - ${product.price}`;
    productList.appendChild(listItem);
  });
});
