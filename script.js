let timeoutId;
function debounce(cb, dely = 5_00) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    cb();
  }, dely);
}


const productsResponse = [
  {
    id: 1,
    title: "Gold Hoop Earrings",
    shortDesc: "Classic 14k gold hoop earrings with a polished finish.",
    imageUrl: "assets/products/gold_hoop_earrings.jpg",
    price: 120.00,
  },
  {
    id: 2,
    title: "Silver Pendant Necklace",
    shortDesc: "Sterling silver necklace with a delicate heart-shaped pendant.",
    imageUrl: "assets/products/silver_pendant_necklace.jpg",
    price: 75.50,
  },
  {
    id: 3,
    title: "Diamond Stud Earrings",
    shortDesc: "Timeless diamond studs set in white gold.",
    imageUrl: "assets/products/diamond_stud _earrings.jpg",
    price: 450.00,
  },
  {
    id: 4,
    title: "Rose Gold Bangle",
    shortDesc: "Sleek rose gold bangle bracelet with a minimalist design.",
    imageUrl: "assets/products/rose_gold_bangle.jpg",
    price: 210.00,
  },
  {
    id: 5,
    title: "Pearl Drop Earrings",
    shortDesc: "Elegant freshwater pearl drops on sterling silver hooks.",
    imageUrl: "assets/products/pearl_drop_earrings.jpg",
    price: 95.00,
  },
  {
    id: 6,
    title: "Charm Bracelet",
    shortDesc: "Adjustable silver bracelet with multiple mini charms.",
    imageUrl: "assets/products/charm_bracelet.jpg",
    price: 150.00,
  },
  {
    id: 7,
    title: "Emerald Ring",
    shortDesc: "Sterling silver ring featuring an oval emerald stone.",
    imageUrl: "assets/products/emerald_ring.jpg",
    price: 320.00,
  },
  {
    id: 8,
    title: "Gold Chain Necklace",
    shortDesc: "Thick 18k gold-plated chain for a bold statement.",
    imageUrl: "assets/products/gold_chain_necklace.jpg",
    price: 280.00,
  },
];

const list = document.querySelector("#main-list");
const input = document.querySelector("#search-input");

const popupContainer = document.querySelector("#products-details-popup");
const popup = document.querySelector('#products-details-content');
const popupTitle = document.querySelector('#popup-title');
const popupContent = document.querySelector('#popup-content');
const imgPopup = document.querySelector("#img-popup");
const cart = document.querySelector("#badge");
input.addEventListener("input", searchProducts);
const recommendedProducts = productsResponse.filter(p => p.id % 2 === 0)
const popularProducts = productsResponse.filter(p => p.id % 3 === 0)

const recommendedList = document.querySelector("#recommended-list");
const popularList = document.querySelector("#popular-list");
const recommendedToggle = document.querySelector("#recommended-toggle");
const popularToggle = document.querySelector("#popular-toggle");
const carouselTrack = document.querySelector("#carousel-track");
const carouselPages = document.querySelectorAll(".carousel-page");

let currentCarouselIndex = 0;
let autoSlideInterval;

let cartList = [];


function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    cartList = JSON.parse(storedCart);
  }
  updateCartDisplay();
}

function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartList));
}

function getInputValue() {
  return input.value;
}

function updateCartDisplay() {
  const uniqueItemCount = new Set(cartList.map(item => item.id)).size;
  cart.innerHTML = uniqueItemCount;
  saveCartToLocalStorage();
  if (cartSideNav.style.width === "350px") {
    renderCartSidenav();
  }
}

function renderCartSidenav() {
  cartItemsContainer.innerHTML = "";

  if (cartList.length === 0) {
    cartItemsContainer.innerHTML = "<p style='color:white; text-align:center; padding-top:20px;  font-size: 1.6rem;'>Add some products to your cart first.</p>";
  } else {
    const cartTitle = document.createElement("h2");
    cartTitle.textContent = "Your Cart";
    cartTitle.style.color = "white";
    cartTitle.style.textAlign = "center";
    cartTitle.style.marginBottom = "20px";
    cartItemsContainer.appendChild(cartTitle);

    const groupedCartItems = cartList.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 0 };
      }
      acc[item.id].quantity++;
      return acc;
    }, {});

    Object.values(groupedCartItems).forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("cart-item");
      productDiv.dataset.productId = product.id;

      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.title;

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("cart-item-details");

      const title = document.createElement("h4");
      title.textContent = product.title;

      const priceText = document.createElement("p");
      priceText.textContent = `$${product.price.toFixed(2)}`;
      priceText.style.color = "#ccc";

      detailsDiv.appendChild(title);
      detailsDiv.appendChild(priceText);

      const controlsDiv = document.createElement("div");
      controlsDiv.classList.add("cart-item-controls");

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "-";
      decreaseButton.onclick = () => decreaseQuantity(product.id);

      const quantitySpan = document.createElement("span");
      quantitySpan.textContent = product.quantity;
      quantitySpan.id = `quantity-${product.id}`;

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.onclick = () => increaseQuantity(product.id);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remove";
      deleteButton.onclick = () => deleteItem(product.id);

      controlsDiv.appendChild(decreaseButton);
      controlsDiv.appendChild(quantitySpan);
      controlsDiv.appendChild(increaseButton);
      controlsDiv.appendChild(deleteButton);

      productDiv.appendChild(img);
      productDiv.appendChild(detailsDiv);
      productDiv.appendChild(controlsDiv);

      cartItemsContainer.appendChild(productDiv);
    });

    const clearAllButton = document.createElement("button");
    clearAllButton.textContent = "Clear Cart";
    clearAllButton.classList.add("cart-clear-button");
    clearAllButton.onclick = clearCart;
    cartItemsContainer.appendChild(clearAllButton);

    const totalPrice = cartList.reduce((total, item) => total + item.price, 0);
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    totalPriceElement.style.color = "white";
    totalPriceElement.style.textAlign = "right";
    totalPriceElement.style.padding = "20px";
    totalPriceElement.style.fontSize = "1.2em";
    cartItemsContainer.appendChild(totalPriceElement);
  }
}

function increaseQuantity(productId) {
  const productToAdd = productsResponse.find(p => p.id === productId);
  if (productToAdd) {
    cartList.push(productToAdd);
    updateCartDisplay();
    saveCartToLocalStorage();
  }
}

function decreaseQuantity(productId) {
  const index = cartList.findIndex(p => p.id === productId);
  if (index !== -1) {
    cartList.splice(index, 1);
    updateCartDisplay();
    saveCartToLocalStorage();
  }
}

function deleteItem(productId) {
  cartList = cartList.filter(p => p.id !== productId);
  updateCartDisplay();
  saveCartToLocalStorage();
}

function clearCart() {
  cartList = [];
  updateCartDisplay();
  saveCartToLocalStorage();
  renderAllSections();
}

function searchProducts(e) {
  debounce(() => {
    const inputValue = getInputValue().toLowerCase();
    const matchedProducts = productsResponse.filter((product) =>
      product.title.toLowerCase().includes(inputValue)
    );
    renderProducts(matchedProducts, list);
  });
}


const cartButton = document.querySelector(".cart-button");

cartButton.addEventListener("click", () => {
  if (cartSideNav.style.width === "0px" || cartSideNav.style.width === "") {
    openNav();
    renderCartSidenav();
  } else {
    closeNav();
  }
});


const cartSideNav = document.getElementById("mySidenav");
const overlay = document.getElementById("overlay");
const closeBtn = document.querySelector(".closebtn");
const cartItemsContainer = document.getElementById("cart-items-container");

function openNav() {
  cartSideNav.style.width = "350px";
  overlay.style.width = "100%";
}

function closeNav() {
  cartSideNav.style.width = "0";
  overlay.style.width = "0";
}

closeBtn.addEventListener("click", closeNav);
overlay.addEventListener("click", closeNav);

function createProductElement(product) {
  try {
    const productElementContainer = document.createElement("div");
    const productElementImage = document.createElement("img");
    productElementImage.alt = product.title;
    const productElementTitle = document.createElement("h3");
    const productElementDescription = document.createElement("p");
    const productElementPrice = document.createElement("p");
    const productElementId = document.createElement("span");
    const productElementCartButton = document.createElement("button");
    const productElementProductSum = document.createElement("p");
    const productElementCartButtonMinus = document.createElement("button");

    productElementContainer.classList.add("product-card");
    productElementTitle.textContent = product.title;
    productElementDescription.textContent = product.shortDesc;
    productElementPrice.textContent = `$${product.price.toFixed(2)}`;
    productElementPrice.classList.add("product-price");
    productElementId.textContent = `ID: ${product.id}`;
    productElementId.classList.add("product-id");
    productElementImage.src = product.imageUrl;
    productElementImage.classList.add('product-image');
    const quantityControls = document.createElement("div");
    quantityControls.classList.add("quantity-controls");
    productElementProductSum.classList.add("product-id");


    const initialQuantity = cartList.filter(item => item.id === product.id).length;
    productElementProductSum.textContent = initialQuantity;

    productElementCartButton.textContent = "+";
    productElementCartButton.className = "addToCart";
    productElementCartButtonMinus.textContent = "-";
    productElementCartButtonMinus.className = "addToCart";

    productElementCartButton.onclick = function (e) {
      e.stopPropagation();
      cartList.push(product);
      updateCartDisplay();
      let currentValue = parseInt(productElementProductSum.textContent);
      productElementProductSum.textContent = currentValue + 1;
    };
    productElementContainer.onclick = function () {
      popupContainer.classList.add('active');
      popupTitle.textContent = product.title;
      popupContent.textContent = product.shortDesc;
      imgPopup.src = product.imageUrl;
    };

    popupContainer.addEventListener('click', (e) => {
      if (e.target === popupContainer) {
        popupContainer.classList.remove('active');
      }
    });
    productElementCartButtonMinus.onclick = function (e) {
      e.stopPropagation();
      const index = cartList.findIndex(p => p.id === product.id);
      if (index !== -1) {
        cartList.splice(index, 1);
        updateCartDisplay();
        let currentValue = parseInt(productElementProductSum.textContent);
        if (currentValue > 0) {
          productElementProductSum.textContent = currentValue - 1;
        }
      }
    };

    quantityControls.appendChild(productElementCartButton);
    quantityControls.appendChild(productElementProductSum);
    quantityControls.appendChild(productElementCartButtonMinus);

    productElementContainer.appendChild(productElementImage);
    productElementContainer.appendChild(productElementTitle);
    productElementContainer.appendChild(productElementDescription);
    productElementContainer.appendChild(productElementPrice);
    productElementContainer.appendChild(productElementId);
    productElementContainer.appendChild(quantityControls);

    return productElementContainer;
  } catch (error) {
    return null;
  }
}

function renderProducts(products, targetElement) {
  targetElement.innerHTML = "";

  if (products.length === 0) {
    targetElement.innerHTML = '<p class="empty-list">No products found.</p>';
    return;
  }

  products.forEach((p, index) => {
    const productElement = createProductElement(p);
    productElement.style.animationDelay = `${index * 0.1}s`;
    targetElement.appendChild(productElement);
    setTimeout(() => {
      productElement.classList.add('product-fade-in');
    }, 10);
  });
}

function showCarouselPage(index) {
  carouselTrack.style.transform = `translateX(-${index * 100}%)`;
  currentCarouselIndex = index;

  recommendedToggle.classList.remove('active');
  popularToggle.classList.remove('active');
  if (index === 0) {
    recommendedToggle.classList.add('active');
  } else {
    popularToggle.classList.add('active');
  }
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const nextIndex = (currentCarouselIndex + 1) % carouselPages.length;
    showCarouselPage(nextIndex);
  }, 5000);
}

function showLoadingState() {
  const loadingHtml = `
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
    <div class="skeleton-loader"></div>
  `;
  recommendedList.innerHTML = loadingHtml;
  popularList.innerHTML = loadingHtml;
  list.innerHTML = loadingHtml;
}

function renderAllSections() {
  showLoadingState();

  setTimeout(() => {
    renderProducts(recommendedProducts, recommendedList);
    renderProducts(popularProducts, popularList);
    renderProducts(productsResponse, list);
    showCarouselPage(0);
    startAutoSlide();
  }, 1500);
}


recommendedToggle.addEventListener('click', () => {
  showCarouselPage(0);
  startAutoSlide();

});

popularToggle.addEventListener('click', () => {
  showCarouselPage(1);
  startAutoSlide();
});

const nav = document.querySelector("nav");
const headerTitle = document.querySelector(".header-title");


window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    headerTitle.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
    headerTitle.classList.remove("scrolled");
  }
});

const darkModeButton = document.getElementById("dark-mode-button");
const darkModeIcon = document.getElementById("dark-mode-icon");
const body = document.body;

function updateDarkModeIcon(isDarkMode) {
  if (isDarkMode) {
    darkModeIcon.classList.remove("fa-sun");
    darkModeIcon.classList.add("fa-moon");
  } else {
    darkModeIcon.classList.remove("fa-moon");
    darkModeIcon.classList.add("fa-sun");
  }
}

function toggleDarkMode() {
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
  updateDarkModeIcon(isDarkMode);
}

function loadDarkModePreference() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    body.classList.add("dark-mode");
  }
  updateDarkModeIcon(isDarkMode);
}

darkModeButton.addEventListener("click", toggleDarkMode);

loadDarkModePreference();
loadCartFromLocalStorage();
renderAllSections();
