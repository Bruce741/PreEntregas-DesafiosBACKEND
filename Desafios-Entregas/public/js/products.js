const btns = document.getElementsByTagName("button");

const addProductToCart = async (pId,cId) => {
  const result = await fetch(
    `http://localhost:8080/api/carts/:cId/product/${pId}`,
    {
      body: JSON.stringify({
        quantity: 1,
      }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

for (let btn of btns) {
  btn.addEventListener("click", (event) => {
    addProductToCart(btn.id);
  });
}
