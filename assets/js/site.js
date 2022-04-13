"use strict";

// Simulate data received from server
var cartProducts = {
  "Hacker Certification": {
    desc: "This certification will turn you into a hacker.",
    price: 100
  },
  "Good Hacker Certification": {
    desc: "This certification will turn you into a good hacker.",
    price: 200
  },
  "Great Hacker Certification": {
    desc: "This certification will turn you into a great hacker.",
    price: 300
  },
  "Pro Hacker Certification": {
    desc: "This certification will turn you into a pro hacker.",
    price: 400
  },
  "Super Hacker Certification": {
    desc: "This certification will turn you into a super hacker.",
    price: 500
  },
  "Ultra Hacker Certification": {
    desc: "This certification will turn you into a ultra hacker.",
    price: 600
  },
  "Ultra Plus Hacker Certification": {
    desc: "This certification will turn you into a ultra plus hacker.",
    price: 700
  },
  "Ethical Hacker Certification": {
    desc: "This certification will turn you into a ethical hacker.",
    price: 300
  },
  "White Hacker Certification": {
    desc: "This certification will turn you into a white hacker.",
    price: 450
  },
  "Teacher Hacker Certification": {
    desc: "This certification will turn you into a teacher hacker.",
    price: 250
  },
  "Penetration Hacker Certification": {
    desc: "This certification will turn you into a penetration hacker.",
    price: 200
  },
  "Offensive Hacker Certification": {
    desc: "This certification will turn you into a offensive hacker.",
    price: 350
  }
}

var cart = loadCartFromStorage();

// ======================================
// ===== LocalStorage Functionality =====
// ======================================
function loadCartFromStorage() {
  if (localStorage.getItem("cart")) {
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return {};
  }
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
  cart = {};
  saveCartToStorage();
}

// ==============================
// ===== Cart Functionality =====
// ==============================
function cartAddProduct(name, quantity=1) {
  if (isNaN(quantity) || !(name in cartProducts) || quantity <= 0) 
    return false;
  
  if (!(name in cart)) { // Item not in cart
    cart[name] = quantity
  } else { // Item exists in cart
    cart[name] += quantity
  }

  saveCartToStorage();
  return true;
}

function cartRemoveProduct(name, quantity=1) {
  if (isNaN(quantity) || !(name in cartProducts) || !(name in cart) || quantity <= 0) 
    return false;

  let count = cart[name]
  if (quantity >= count) { // Remove entirely
    delete cart[name];
  } else { // Update count
    cart[name] -= quantity;
  }
  
  saveCartToStorage();
  return true;
}

function cartSetProductQuantity(name, quantity=1) {
  if (isNaN(quantity) || !(name in cartProducts) || quantity <= 0)
    return false;
  
  cart[name] = quantity;
  
  saveCartToStorage();
  return true;
}

// ==========================
// ===== Update Summary =====
// ==========================
function updateSummary() {
  let summary = document.getElementById("cart-summary")
  if (!summary) { // Should not be called on pages without summary display
    console.log("This page has no summary.")
    return
  }

  let totListElem = summary.querySelector("#cost-total.category").parentElement
  let subtotListElem = summary.querySelector("#cost-subtotal.category").parentElement
  let feeListElem = summary.querySelector("#cost-fee.category").parentElement
  let taxListElem = summary.querySelector("#cost-tax.category").parentElement

  let totValueElem = totListElem.getElementsByClassName("value")[0]
  let subtotValueElem = subtotListElem.getElementsByClassName("value")[0]
  let feeValueElem = feeListElem.getElementsByClassName("value")[0]
  let taxValueElem = taxListElem.getElementsByClassName("value")[0]

  let total = 0, subtotal = 0, fee = 50, tax = 0;

  for (const [title, count] of Object.entries(cart)) {
    if (title in cartProducts) {
      if (isNaN(count) || count <= 0) {
        console.log(`ERROR: ${title} has invalid count.`)
        continue
      }

      let productDetails = cartProducts[title]
      total = subtotal += (productDetails.price * count)
    } else {
      console.log(`ERROR: "${title}" Not found in cartProducts`)
    }
  }

  tax = subtotal * (6.25/100) // 6.25% fee
  total = subtotal + tax + fee;

  totValueElem.textContent = `$${total}`
  subtotValueElem.textContent = `$${subtotal}`
  feeValueElem.textContent = `$${fee}`
  taxValueElem.textContent = `$${tax}`
}

// For pages with main containers
var pageMain = document.querySelector("main")

// === HOMESCREEN ===
if (pageMain && pageMain.id === "homescreen") {
  // ==============================
  // ===== Cart Functionality =====
  // ==============================
  var products = document.querySelectorAll(".products");

  products.forEach(product => {
    product.addEventListener("click", function(event) {
      let title = this.querySelector(".product-title").textContent.trim()
      let price = this.querySelector(".product-price").textContent.trim()
      price = price.match(/\d+/g) // Extract digits

      if (price.length > 0) {
        price = parseInt(price[0]) // Set as integer
      } else {
        console.log(`ERROR PARSING PRICE: ${title}`)
        return
      }

      if (!(title in cartProducts)) {
        console.log(`TITLE NOT FOUND: ${title}`)
        console.log("!! FIX ELEMENT !!", this)
        return
      }

      if (!cartAddProduct(title)) {
        console.log(`ERROR ADDING ${title} TO CART`)
        console.log("!! FIX ELEMENT !!", this)
        return
      }
    })
  })

  // =========================================
  // ===== Product Display Functionality =====
  // =========================================
  // Dynamically load/update store items
  function pageAddProduct(name, quantity=1) {
    // TODO
  }
  
  function pageRemoveProduct(name, quantity=1) {
    // TODO
  }
  
  function pageSetProductQuantity(name, quantity=1) {
    // TODO
  }
}

// For pages with form container
var pageForm = document.forms[0]; // First form on page


// === Cart ===
if (pageForm && pageForm.id == "cart") {
  // =========================================
  // ===== Product Display Functionality =====
  // =========================================
  // Remove/update element in cart
  function getProductTemplate() {
    let templateHTML = `
      <img class="icon" src="../assets/img/trophy.png" alt="Certificate Image">
      <ul class="details">
        <li class="title"></li>
        <li class="description"></li>
      </ul>
      <li class="misc">
        <h2 class="price"></h2>
        <input type="button" class="remove" value="Remove">
        <input type="button" class="edit" value="Edit">
      </li>
    `

    let product = document.createElement("ul")
    product.className = "cart-item"
    product.innerHTML = templateHTML

    return product
  }

  let cartContainer = document.getElementById("cart-items")
  let template = getProductTemplate() // Blank product element

  function pageAddProduct(name, quantity=1) {
    if (isNaN(quantity) || !(name in cartProducts) || quantity <= 0) 
      return false;

    let productDetails = cartProducts[name]
    let newProduct = template.cloneNode(true) // Clone deep

    let titleElem = newProduct.querySelector(".title")
    let descElem = newProduct.querySelector(".description")
    let priceElem = newProduct.querySelector(".price")
    
    console.log(name)
    console.log(newProduct)
    console.log(titleElem, descElem, priceElem)
    
    titleElem.textContent = name
    descElem.textContent = productDetails.desc
    priceElem.textContent = `$${productDetails.price}`
    
    cartContainer.appendChild(newProduct)
    return true
  }
  
  function pageRemoveProduct(name, quantity=1) {
    // TODO
  }
  
  function pageSetProductQuantity(name, quantity=1) {
    // TODO
  }

  // == Remove Button Functionality ==

  // == Edit Button Functionality ==

  // == Load Cart ==
  for (const [title, count] of Object.entries(cart)) {
    if (title in cartProducts) {
      pageAddProduct(title, count)
    } else {
      console.log(`ERROR: "${title}" Not found in cartProducts`)
    }
  }

  updateSummary(); // Update summary display
}

// === Checkout ===
if (pageForm && pageForm.id == "checkout") { // Apply to checkout webpage
  // == Update Summary ==
  updateSummary()
  
  // ===== Enforce Billing Address Validation =====
  function toggleBillingAddressValidation(validate) {
    let inputs = document.querySelectorAll("#address-b-form input")
    let ignore_ids = ["address2-b"]

    inputs.forEach(input => {
      // Don't change ignored ids
      input.required = (!ignore_ids.includes(input.id)) ? validate : input.required
    })
  }

  var billingCheckbox = document.getElementById("show-address-b")

  toggleBillingAddressValidation(billingCheckbox.checked) // Handle current state
  billingCheckbox.addEventListener("click", function() { // Handle state changes
    toggleBillingAddressValidation(billingCheckbox.checked)
  })
}
