document.addEventListener("DOMContentLoaded", function () {
  callGetProducts();
  updateCartBadge();
  // Listen for custom cart update events
  window.addEventListener("cartUpdated", updateCartBadge);

  // Listen for storage events (changes from other tabs/windows)
  window.addEventListener("storage", function (event) {
    if (event.key === "cart") {
      updateCartBadge();
    }
  });
});

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBadge = document.getElementById("cart-count");
  cartBadge.innerText = cart.length;
}

const callGetProducts = () => {
  const products_list = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  if (products_list.length == 0) {
    document.getElementById("cart-items").innerHTML =
      "<h1>No products in cart</h1>";
    return;
  }

  fetch("/findProducts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: products_list,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let totalRate = 0;
      let totalDeposit = 0;
      console.log(data);
      const products = data.data;
      const productContainer = document.getElementById("cart-items");
      productContainer.innerHTML = "";
      products.forEach((product) => {
        console.log(product);

        const product_id = product._id;
        const productCard = document.createElement("div");
        totalRate =
          Number.parseInt(totalRate) + Number.parseInt(product.rental_rate);
        totalDeposit =
          Number.parseInt(totalDeposit) +
          Number.parseInt(product.deposit_amount);
        productCard.className = "product-card";
        productCard.innerHTML = `
          <img src="${product.image_url}" alt="${product.name}" />
          <div class="product-info">
            <h5>Appliance Name: ${product.brand} ${product.type}</h5>
            <p>Condition: ${product.condition}</p>
            <p>Rental Rate: $<span id="rental-rate-${product_id}">${product.rental_rate}</span></p>
            <p>Deposit Amount: $<span id="deposit-amount-${product_id}">${product.deposit_amount}</span></p>
            <span>
            <label for="quantity-${product_id}">Quantity:</label>
          
            <input type="number" id="quantity-${product_id}" class="quantity-input" value="1" min="1" onchange="updateProductTotal('${product_id}', ${totalRate}, ${totalDeposit}, this.value)">
            </span>
          </div>
           <button class="delete-button" onclick="deleteFromCart('${product_id}')">Delete</button>
        
        `;

        productContainer.appendChild(productCard);
      });

      const total = document.createElement("div");
      total.className = "total";
      total.innerHTML = `
      <div style="text-align:right">
          <h3>Total Rental Rate: $<span id="total-rate">${totalRate}</span></h3>
          <h3>Total Deposit Amount: $<span id="total-deposit">${totalDeposit}</span></h3>
        </div>
        <div class="checkout-container">
          <button class="checkout-button" onclick="onCartClick()">Checkout</button>
        </div>
      `;
      productContainer.appendChild(total);
    });
};

const deleteFromCart = (product_id) => {
  console.log(product_id);
  const products_list = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  const new_products_list = products_list.filter(
    (product) => product !== product_id
  );
  console.log(new_products_list);
  localStorage.setItem("cart", JSON.stringify(new_products_list));
  callGetProducts();
  window.dispatchEvent(new Event("cartUpdated"));
};

const onCartClick = () => {
  window.location.href = "/cart";
};

const updateProductTotal = (productId, rentalRate, depositAmount, quantity) => {
  const rentalRateElement = document.getElementById(`rental-rate-${productId}`);
  const depositAmountElement = document.getElementById(
    `deposit-amount-${productId}`
  );
  const newRentalRate = rentalRate * quantity;
  const newDepositAmount = depositAmount * quantity;
  rentalRateElement.textContent = newRentalRate;
  depositAmountElement.textContent = newDepositAmount;

  updateTotal();
};

const updateTotal = () => {
  const productCards = document.querySelectorAll(".product-card");
  let totalRate = 0;
  let totalDeposit = 0;

  productCards.forEach((card) => {
    const rentalRate = parseFloat(
      card.querySelector(".product-info span[id^='rental-rate']").textContent
    );
    const depositAmount = parseFloat(
      card.querySelector(".product-info span[id^='deposit-amount']").textContent
    );
    totalRate += rentalRate;
    totalDeposit += depositAmount;
  });

  document.getElementById("total-rate").textContent = totalRate;
  document.getElementById("total-deposit").textContent = totalDeposit;
};
