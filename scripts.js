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
    <p>${m.price}</p>
    ${m.sale ? `<p class="sale">On Sale</p>` : ''}
    <p class="add-cart" data-product=${m.id}>Add to Cart</p>
    </div>
    `;
    container.appendChild(item);
  });
};

window.addEventListener('load', () => {
  //Select all our add cards
  addItems();
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
  let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
}

//Functions to run on load
checkCart();
displayCart();
