const data = [
  {
    id: 1,
    name: "Bear's Den - So That You Might Hear Me",
    image: 'img/bearsden.jpg',
    price: '20.00',
    description: "Latest album from Bear's Den",
    sale: false,
    inCart: 0,
  },
  {
    id: 2,
    name: 'Blink 182 - Nine',
    image: 'img/nine.png',
    price: '10.00',
    description: 'Limited edition pink vinyl',
    sale: true,
    inCart: 0,
  },
  {
    id: 3,
    name: 'Neck Deep - All Distortions are Intentional',
    image: 'img/nd.jpg',
    price: '15.00',
    description: 'Brand new album from the kings of pop-punk',
    sale: false,
    inCart: 0,
  },
];

//Add our shop items
const container = document.querySelector('.container');

const addItems = async () => {
  await data.map((m) => {
    const item = document.createElement('div');
    item.innerHTML = `
    <div class="item" >
    <h2>${m.name}</h2>
    <img src="${m.image}" alt="${m.title}">
    <p>${m.description}</p>
    <p>£${m.price}</p>
    ${m.sale ? `<p class="sale">On Sale</p>` : ''}
    <p class="add-cart" data-product=${m.id}>Add to Cart</p>
    </div>
    `;
    container.appendChild(item);
  });
};

window.addEventListener('load', () => {
  //Select all our add cards
  if (document.querySelector('.container')) {
    addItems();
  }

  setTimeout(() => {
    const cartButtons = document.querySelectorAll('.add-cart');
    for (let i = 0; i < cartButtons.length; i++) {
      cartButtons[i].addEventListener('click', () => {
        addToCart(data[i]);
        cartButtons[i].classList.add('added-to-cart');
        cartButtons[i].textContent = 'Added To Cart';
        setTimeout(() => {
          cartButtons[i].classList.remove('added-to-cart');
          cartButtons[i].textContent = 'Add to Cart';
        }, 700);
      });
    }
  }, 1000);
});

function addToCart(product) {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);

  if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.cart-count').innerHTML = productNumbers + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.cart-count').textContent = 1;
  }

  setItems(product);
}

//Function to check if we have anything in cart
function checkCart() {
  if (localStorage.getItem('cartNumbers')) {
    document.querySelector('.cart-count').textContent = localStorage.getItem(
      'cartNumbers'
    );
  }
}

//Function to set our items for the cart
function setItems(product) {
  product.inCart = 1;
  let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
  if (cartItems != null) {
    if (cartItems[product.id] == undefined) {
      cartItems = {
        ...cartItems,
        [product.id]: product,
      };
    }
    cartItems[product.id].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.id]: product,
    };
  }

  localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

//Our Cart file script
function displayCart() {
  const cartPageContainer = document.querySelector('.cart-container');
  let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
  if (cartItems && cartPageContainer) {
    cartPageContainer.innerHTML = '';
    let totalCost = 0;

    //First add headings
    const headings = document.createElement('div');
    headings.classList.add('single-cart-item');
    headings.classList.add('cart-title');
    headings.innerHTML = `
    <p>Item</p>
    <p class="quantity-cell">Quantity</p>
    <p>Item Cost</p>
    <p>Total Cost</p>`;
    cartPageContainer.appendChild(headings);
    //Go through our objects
    Object.values(cartItems).map((item) => {
      const newItem = document.createElement('div');
      newItem.classList.add('single-cart-item');
      newItem.innerHTML = `
      <p><img src="${item.image}">${item.name}</p>
      <p class="quantity-cell"><span class="reduce" data-product=${
        item.id
      }>-</span><span class="in-cart-total">${
        item.inCart
      }</span><span class="increase" data-product="${item.id}">+</span></p>
      <p>£${item.price}</p>
      <p>£${parseFloat(item.price) * parseFloat(item.inCart)}</p>
      `;
      cartPageContainer.appendChild(newItem);
      totalCost = totalCost + parseFloat(item.price) * parseFloat(item.inCart);
    });
    const costItem = document.createElement('div');
    costItem.classList.add('single-cart-item');
    costItem.classList.add('total-cart-cost');
    costItem.innerHTML = `
    <p></p><p></p><p>Total</p><p>£${totalCost}</p>`;
    cartPageContainer.appendChild(costItem);
    setPlusMinus();
  } else if (cartPageContainer) {
    cartPageContainer.innerHTML = '';
    const message = document.createElement('div');
    message.textContent =
      "Looks like you don't have anything in your cart...time to go shopping!";
    cartPageContainer.appendChild(message);
  }
}

//Functions to run on load
checkCart();
displayCart();

function setPlusMinus() {
  //Add Event Listeners to plus and minus
  const cartPageContainer = document.querySelector('.cart-container');

  if (cartPageContainer) {
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.reduce');
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let productNumbers = localStorage.getItem('cartNumbers');

    //Set up increase buttons
    for (let i = 0; i < increaseButtons.length; i++) {
      increaseButtons[i].addEventListener('click', () => {
        const id = increaseButtons[i].getAttribute('data-product');
        cartItems[id].inCart++;
        productNumbers = parseInt(productNumbers) + 1;
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        localStorage.setItem('cartNumbers', productNumbers);
        displayCart();
        reloadCartCount();
      });
    }

    //Set up decrease buttons
    for (let i = 0; i < decreaseButtons.length; i++) {
      decreaseButtons[i].addEventListener('click', () => {
        const id = decreaseButtons[i].getAttribute('data-product');
        cartItems[id].inCart--;
        //If its now zero we should remove it
        if (cartItems[id].inCart === 0) {
          delete cartItems[id];
        }

        if (Object.keys(cartItems).length === 0) {
          localStorage.removeItem('productsInCart');
          localStorage.removeItem('cartNumbers');
        } else {
          productNumbers = parseInt(productNumbers) - 1;
          localStorage.setItem('productsInCart', JSON.stringify(cartItems));
          localStorage.setItem('cartNumbers', productNumbers);
        }
        displayCart();
        reloadCartCount();
      });
    }
  }
}

function reloadCartCount() {
  const cartNum = localStorage.getItem('cartNumbers');
  if (cartNum) {
    document.querySelector('.cart-count').textContent = parseInt(cartNum);
  } else {
    document.querySelector('.cart-count').textContent = 0;
  }
}
