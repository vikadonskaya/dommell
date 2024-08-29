(function() {
  const productsContainer = document.querySelector("#grid");
  const cartContainer = document.querySelector("#shopping-cart");
  const cartContent = document.querySelector("#cart-content");
  const toggleCartBtn = document.querySelector("#toggle-cart-btn");
  const clearCartBtn = document.querySelector("#clear-cart");
  const checkoutBtn = document.querySelector("#checkout-btn");
  const totalPriceContainer = document.querySelector("#total-price");


  function toggleCart() {
    cartContainer.classList.toggle("open");
  }

  function getLSContent() {
    const lsContent = JSON.parse(localStorage.getItem("products")) || [];
    return lsContent;
  }

  function setLSContent(lsContent) {
    localStorage.setItem("products", JSON.stringify(lsContent));
  }

  function calculateTotal(prices) {
    return prices.reduce(function(prev, next) {
      return prev + next;
    }, 0);
  }

  function getCartItemPrices() {
    const prices = [];
    let nums = cartContent.querySelectorAll("tr td:nth-child(3)");

    if (nums.length > 0) {
      for (let cell = 0; cell < nums.length; cell++) {
        let num = nums[cell].innerText;
        num = num.replace(/[^\d]/g, "");
        num = parseFloat(num);
        prices.push(num);
      }
      return prices;
    } else {
      return;
    }
  }

  function displayCartTotal() {
    const prices = getCartItemPrices();
    let total = 0;
    if (prices) {
      total = calculateTotal(prices);
      totalPriceContainer.innerHTML = `<span class="total">Total: $${total.toFixed(
        2
      )}</span>`;
    } else {
      totalPriceContainer.innerHTML = '<span class="total">Total: $0</span>';
    }
  }

  function displayProducts() {
    const lsContent = getLSContent();
    let productMarkup = "";
    if (lsContent !== null) {
      for (let product of lsContent) {
        productMarkup += `
          <tr>
          <td><img class="cart-image" src="${product.image}" alt="${
          product.name
        }" width="120"></td>
          <td>
            ${product.name}
          </td>
          <td>${product.price}</td>
          <td><a href="#" data-id="${product.id}" class="remove">X</a></td>
          </tr>
        `;
      }
    } else {
      productMarkup = "Your cart is empty.";
    }
    cartContent.querySelector("tbody").innerHTML = productMarkup;
  }

  function saveProduct(clickedBtn) {
    const productId = clickedBtn.getAttribute("data-id");
    const card = clickedBtn.parentElement.parentElement;
    const cardInfo = clickedBtn.parentElement;
    const prodImage = card.querySelector("img").src;
    const prodName = cardInfo.querySelector("h4").textContent;
    const prodPrice = cardInfo.querySelector(".card__price").textContent;

    let isProductInCart = false;

    const lsContent = getLSContent();

    lsContent.forEach(function(product) {
      if (product.id === productId) {
        alert("This course is already in your cart.");
        isProductInCart = true;
      }
    });

    if (!isProductInCart) {
      lsContent.push({
        id: productId,
        image: prodImage,
        name: prodName,
        price: prodPrice
      });

      setLSContent(lsContent);
      displayProducts();
    }
  }

  function removeProduct(productId) {
    const lsContent = getLSContent();

    let productIndex;
    lsContent.forEach(function(product, i) {
      if (product.id === productId) {
        productIndex = i;
      }
    });


    lsContent.splice(productIndex, 1);
    setLSContent(lsContent);

    displayProducts();
  }

  function clearCart() {
    const lsContent = getLSContent();
    lsContent.splice(0, lsContent.length);
    setLSContent(lsContent);
    displayProducts();
  }

  function checkout() {
    const cartProducts = cartContent.querySelector("tbody").innerHTML;
    if (cartProducts !== "" && confirm("Are you sure you want to checkout?")) {
      clearCart();
    } else {
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", function(e) {
    displayProducts();
    displayCartTotal();
  });

  toggleCartBtn.addEventListener("click", function(e) {
    e.preventDefault();
    toggleCart();
  });

  productsContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      const clickedBtn = e.target;
      saveProduct(clickedBtn);
    }
  });

  productsContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart")) {
      displayCartTotal();
    }
  });

  cartContent.querySelector("tbody").addEventListener("click", function(e) {
    e.preventDefault();
    const clickedBtn = e.target;
    if (e.target.classList.contains("remove")) {
      const productId = clickedBtn.getAttribute("data-id");
      removeProduct(productId);
      displayCartTotal();
    }
  });

  clearCartBtn.addEventListener("click", function(e) {
    e.preventDefault();
    clearCart();
  });
  clearCartBtn.addEventListener("click", displayCartTotal);

  checkoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    checkout();
  });
  checkoutBtn.addEventListener("click", displayCartTotal);
})();