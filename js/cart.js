let cart = [];
let cartTotal = 0;
const cartDom = document.querySelector(".cart");
const addtocartbtnDom = document.querySelectorAll('[data-action="add-to-cart"]');

addtocartbtnDom.forEach(addtocartbtnDom => {
    addtocartbtnDom.addEventListener("click", () => {
        const productDom = addtocartbtnDom.parentNode.parentNode;
        const product = {
            img: productDom.querySelector(".product-img").getAttribute("src"),
            name: productDom.querySelector(".product-name").innerText,
            price: productDom.querySelector(".product-price").innerText,
            quantity: 1
        };

        const IsinCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;
        if (IsinCart === false) {
            cartDom.insertAdjacentHTML("beforeend", `
  <div class="d-flex flex-row shadow-sm card cart-items mt-2 mb-3 animated flipInX">
    <div class="flex-row ml-2 mr-6" style="width: 70%;">
    <div class="p-2">
        <img src="${product.img}" alt="${product.name}" style="max-width: 40px;"/>
    </div>
    <div class="p-2 mt-3">
        <p class="text-info cart_item_name">${product.name}</p>
    </div>
    <div class="p-2 mt-3">
        <p class="text-success cart_item_price">${product.price}</p>
    </div>
    </div>
    <div class="flex-row m">
    <div class="p-2">
        <button class="btn badge badge-secondary" type="button" data-action="increase-item">&plus;
    </div>
    <div class="p-2">
      <p class="text-success cart_item_quantity">${product.quantity}</p>
    </div>
    <div class="p-2">
      <button class="btn badge badge-info" type="button" data-action="decrease-item">&minus;
    </div>
    <div class="p-2">
      <button class="btn badge badge-danger" type="button" data-action="remove-item">&times;
    </div>
    </div>
  </div> `);

            if (document.querySelector('.cart-footer') === null) {
                cartDom.insertAdjacentHTML("afterend", `
      <div class="d-flex flex-row shadow-sm card cart-footer mt-2 mb-3 animated flipInX">
        <div class="p-2">
          <button class="btn badge-danger" type="button" data-action="clear-cart">Очистить
        </div>
        <div class="p-2 ml-auto">
          <button class="btn badge-dark" type="button" data-action="check-out">Итого<span class="pay"></span> 
            &#10137;
        </div>
      </div>`);
            }

            addtocartbtnDom.innerText = "В корзине";
            addtocartbtnDom.disabled = true;
            cart.push(product);

            const cartItemsDom = cartDom.querySelectorAll(".cart-items");
            cartItemsDom.forEach(cartItemDom => {

                if (cartItemDom.querySelector(".cart_item_name").innerText === product.name) {

                    cartTotal += parseInt(cartItemDom.querySelector(".cart_item_quantity").innerText)
                        * parseInt(cartItemDom.querySelector(".cart_item_price").innerText);
                    document.querySelector('.pay').innerText = cartTotal + " р.";

                    cartItemDom.querySelector('[data-action="increase-item"]').addEventListener("click", () => {
                        cart.forEach(cartItem => {
                            if (cartItem.name === product.name) {
                                cartItemDom.querySelector(".cart_item_quantity").innerText = ++cartItem.quantity;
                                cartItemDom.querySelector(".cart_item_price").innerText = parseInt(cartItem.quantity) *
                                    parseInt(cartItem.price) + " р.";
                                cartTotal += parseInt(cartItem.price)
                                document.querySelector('.pay').innerText = cartTotal + " р.";
                            }
                        });
                    });

                    cartItemDom.querySelector('[data-action="decrease-item"]').addEventListener("click", () => {
                        cart.forEach(cartItem => {
                            if (cartItem.name === product.name) {
                                if (cartItem.quantity > 1) {
                                    cartItemDom.querySelector(".cart_item_quantity").innerText = --cartItem.quantity;
                                    cartItemDom.querySelector(".cart_item_price").innerText = parseInt(cartItem.quantity) *
                                        parseInt(cartItem.price) + " р.";
                                    cartTotal -= parseInt(cartItem.price)
                                    document.querySelector('.pay').innerText = cartTotal + " р.";
                                }
                            }
                        });
                    });

                    cartItemDom.querySelector('[data-action="remove-item"]').addEventListener("click", () => {
                        cart.forEach(cartItem => {
                            if (cartItem.name === product.name) {
                                cartTotal -= parseInt(cartItemDom.querySelector(".cart_item_price").innerText);
                                document.querySelector('.pay').innerText = cartTotal + " р.";
                                cartItemDom.remove();
                                cart = cart.filter(cartItem => cartItem.name !== product.name);
                                addtocartbtnDom.innerText = "Add to cart";
                                addtocartbtnDom.disabled = false;
                            }
                            if (cart.length < 1) {
                                document.querySelector('.cart-footer').remove();
                            }
                        });
                    });

                    document.querySelector('[data-action="clear-cart"]').addEventListener("click", () => {
                        cartItemDom.remove();
                        cart = [];
                        cartTotal = 0;
                        if (document.querySelector('.cart-footer') !== null) {
                            document.querySelector('.cart-footer').remove();
                        }
                        addtocartbtnDom.innerText = "Add to cart";
                        addtocartbtnDom.disabled = false;
                    });

                    document.querySelector('[data-action="check-out"]').addEventListener("click", () => {
                        if (document.getElementById('paypal-form') === null) {
                            checkOut();
                        }
                    });
                }
            });
        }
    });
});

function animateImg(img) {
    img.classList.add("animated", "shake");
}

function normalImg(img) {
    img.classList.remove("animated", "shake");
}

function checkOut() {
    let paypalHTMLForm = `
  <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" >
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="upload" value="1">
    <input type="hidden" name="business" value="gmanish478@gmail.com">
    <input type="hidden" name="currency_code" value="INR">`;

    cart.forEach((cartItem, index) => {
        ++index;
        paypalHTMLForm += ` <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
    <input type="hidden" name="amount_${index}" value="${cartItem.price.replace("р.", "")}">
    <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">`;
    });

    paypalHTMLForm += `<input type="submit" value="PayPal" class="paypal">
  </form><div class="overlay">Please wait...</div>`;
    document.querySelector('body').insertAdjacentHTML("beforeend", paypalHTMLForm);
    document.getElementById("paypal-form").submit();

}
$('.js-open-modal').click(function (event) {
    event.preventDefault();

    var modalName = $(this).attr('data-modal');
    var modal = $('.js-modal[data-modal="' + modalName + '"]');

    modal.addClass('is-show');
    $('.js-modal-overlay').addClass('is-show')
});

$('.js-modal-close').click(function () {
    $(this).parent('.js-modal').removeClass('is-show');
    $('.js-modal-overlay').removeClass('is-show');
});

$('.js-modal-overlay').click(function () {
    $('.js-modal.is-show').removeClass('is-show');
    $(this).removeClass('is-show');
})

const openBtn = document.getElementById('openBtn');
const sideMenu = document.getElementById('sideMenu');

openBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});
function rangeSlide(value) { document.getElementById("rangeValue").innerHTML = value; }






const cardNumber = document.getElementById("card-number");
const cardHolderName = document.getElementById("card-holder-name");
const cardNameInput = document.getElementById("card-name-input");
const displayValidity = document.getElementById("validity");
const validityInput = document.getElementById("validity-input");
const cardNumberDisplay = document.querySelectorAll(".card-number-display");
const cvvInput = document.getElementById("cvv");
const cvvDisplay = document.getElementById("cvv-display");
let currentSpanIndex = 0;
cardNumber.addEventListener("input", () => {
    const inputNumber = cardNumber.value.replace(/\D/g, "");
    cardNumber.value = cardNumber.value.slice(0, 16).replace(/\D/g, "");
    for (let i = 0; i < cardNumberDisplay.length; i++) {
        if (i < inputNumber.length) {
            cardNumberDisplay[i].textContent = inputNumber[i];
        } else {
            cardNumberDisplay[i].textContent = "_";
        }
    }

    if (inputNumber.length <= cardNumberDisplay.length) {
        currentSpanIndex = inputNumber.length;
    } else {
        currentSpanIndex = cardNumberDisplay.length;
    }
});

cardNameInput.addEventListener("input", () => {
    if (cardNameInput.value.length < 1) {
        cardHolderName.innerText = "Your Name Here";
    } else if (cardNameInput.value.length > 30) {
        cardNameInput.value = cardNameInput.value.slice(0, 30);
    } else {
        cardHolderName.innerText = cardNameInput.value;
    }
});

validityInput.addEventListener("input", () => {
    const inputString = validityInput.value;
    if (inputString.length < 1) {
        displayValidity.innerText = "06/28";
        return false;
    }
    const parts = inputString.split("-");
    const year = parts[0].slice(2);
    const month = parts[1];

    const formattedString = `${month}/${year}`;
    displayValidity.innerText = formattedString;
});

cvvInput.addEventListener("input", () => {
    const userInput = cvvInput.value;
    const sanitizedInput = userInput.slice(0, 3);
    const numericInput = sanitizedInput.replace(/\D/g, "");
    cvvInput.value = numericInput;
    cvvDisplay.innerText = numericInput;
});

cvvInput.addEventListener("click", () => {
    document.getElementById("card").style.transform = "rotateY(180deg)";
});
document.addEventListener("click", () => {
    if (document.activeElement.id != "cvv") {
        document.getElementById("card").style.transform = "rotateY(0deg)";
    }
});

window.onload = () => {
    cvvInput.value = "";
    validityInput.value = "";
    cardNameInput.value = "";
    cardNumber.value = "";
};