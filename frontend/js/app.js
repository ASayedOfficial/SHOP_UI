// ================= IMPORT PRODUCTS API =================
import { getProducts } from "./products.js";
import { loadCart } from "./cart.js";

// ================= SELECT MAIN ELEMENTS =================
const container = document.getElementById("productContainer");
const searchInput = document.querySelector(".search-container input");
const categoryButtons = document.querySelectorAll(".category-btn");

// ================= SELECT MODAL ELEMENTS =================
const modal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDetails = document.getElementById("modalDetails");

// ================= CART ELEMENTS =================
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ================= RECEIPT MODAL ELEMENTS =================
const receiptModal = document.getElementById("receiptModal");
const closeReceipt = document.getElementById("closeReceipt");
const paymentButtons = document.querySelectorAll(".payment-btn");

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
});

closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("active");
});

// ================= APP DATA =================
let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= PAGINATION =================
let currentPage = 1;
let productsPerPage = window.innerWidth <= 768 ? 10 : 14;

// ================= HELPER FUNCTIONS =================

// Get product images safely
function getProductImages(product) {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return ["images/no-image.png"];
}

// Get product price safely
function getProductPrice(product) {
    return Number(product.price || product.new_price || 0);
}

// Get old price safely
function getOldPrice(product) {
    return Number(product.old_price || 0);
}

// Create pagination buttons container automatically
function createPaginationContainer() {
    let oldBox = document.getElementById("pagination");

    if (oldBox) oldBox.remove();

    const box = document.createElement("div");
    box.id = "pagination";
    box.style.textAlign = "center";
    box.style.margin = "30px 0";

    container.parentNode.appendChild(box);
}

// ================= RENDER PAGINATION =================
function renderPagination(productList) {
    createPaginationContainer();

    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(productList.length / productsPerPage);

    if (totalPages <= 1) return;

    let html = "";

    html += `
        <button id="prevPage" style="margin:5px;padding:8px 14px;cursor:pointer;">Prev</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn" data-page="${i}" 
            style="
                margin:5px;
                padding:8px 14px;
                cursor:pointer;
                ${i === currentPage ? "background:#1E90FF;color:#fff;" : ""}
            ">
                ${i}
            </button>
        `;
    }

    html += `
        <button id="nextPage" style="margin:5px;padding:8px 14px;cursor:pointer;">Next</button>
    `;

    pagination.innerHTML = html;

    // Page numbers
    document.querySelectorAll(".page-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentPage = Number(btn.dataset.page);
            renderProducts(filteredProducts);
        });
    });

    // ================= GRID CONTROL =================
window.setGrid = function(cols) {
    const container = document.getElementById("productContainer");
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
};

    // Prev
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(filteredProducts);
        }
    });

    // Next
    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(filteredProducts);
        }
    });
}

// ================= RENDER PRODUCTS =================
function renderProducts(productList) {
    container.innerHTML = "";

    if (!productList || productList.length === 0) {
        container.innerHTML =
            "<h2 style='color:white;text-align:center;width:100%;'>No Products Found</h2>";
        createPaginationContainer();
        return;
    }

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const currentProducts = productList.slice(start, end);

    currentProducts.forEach((product) => {
        const productImages = getProductImages(product);
        const price = getProductPrice(product);
        const oldPrice = getOldPrice(product);

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${productImages[0]}" class="product-img" alt="${product.name}">
            <h3>${product.name}</h3>

            <p>
                $${price}
                ${
                    oldPrice > 0
                        ? `<span style="text-decoration:line-through;color:#999;margin-left:8px;">$${oldPrice}</span>`
                        : ""
                }
            </p>

            <button class="add-btn">Add to Cart</button>
        `;

        // Add to cart
        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product._id || product.id);
        });

        // Open modal
        card.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-btn")) return;

        const productId = product._id || product.id;
        window.location.href = `product.html?id=${productId}`;
        });

        container.appendChild(card);
    });

    renderPagination(productList);
}

// ================= OPEN MODAL =================
function openModal(product) {
    const productImages = getProductImages(product);
    const price = getProductPrice(product);
    const oldPrice = getOldPrice(product);

    modal.style.display = "flex";
    modalImage.src = productImages[0];
    modalName.textContent = product.name;

    let thumbnailsHTML = "";

    if (productImages.length > 1) {
        thumbnailsHTML = `
            <div class="thumbnail-container">
                ${productImages
                    .map(
                        (img) => `
                    <img src="${img}" class="thumb-img">
                `
                    )
                    .join("")}
            </div>
        `;
    }

    modalDetails.innerHTML = `
        ${thumbnailsHTML}
        <p><strong>Price:</strong> $${price}</p>

        ${
            oldPrice > 0
                ? `<p><strong>Old Price:</strong> <span style="text-decoration:line-through;">$${oldPrice}</span></p>`
                : ""
        }

        <p><strong>Category:</strong> ${product.category || ""}</p>
        <p>${product.description || ""}</p>
        <p>${product.details || ""}</p>
        <p><strong>Brand:</strong> ${product.brand || ""}</p>
        <p><strong>Stock:</strong> ${product.stock || 0}</p>
        <p><strong>Rating:</strong> ${product.rating || 0}</p>
        <p><strong>Available:</strong> ${product.available ? "Yes" : "No"}</p>
    `;

    const thumbs = document.querySelectorAll(".thumb-img");

    if (thumbs.length > 0) {
        thumbs[0].classList.add("active-thumb");
    }

    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            modalImage.src = thumb.src;

            thumbs.forEach((img) => img.classList.remove("active-thumb"));
            thumb.classList.add("active-thumb");
        });
    });
}

// ================= ADD TO CART =================
function addToCart(id) {
    const product = allProducts.find((p) => (p._id || p.id) === id);
    if (!product) return;

    const price = getProductPrice(product);
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: product.name,
            price: price,
            quantity: 1,
        });
    }

    // ✅ SAVE TO LOCAL STORAGE
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI();
}

// ================= UPDATE CART UI =================
function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>
                <div>$${item.price * item.quantity}</div>
            </div>
        `;
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = "Total: $" + total;

    // ✅ SAVE AGAIN (important for sync)
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ================= CART TOGGLE =================
cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
});

// ================= CHECKOUT =================
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
    receiptModal.classList.add("active");
});

closeReceipt.addEventListener("click", () => {
    receiptModal.classList.remove("active");
});

paymentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const method = btn.dataset.method;

        const totalAmount = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        alert(
            `Payment Method: ${method}\nTotal Paid: $${totalAmount}\n\nThanks for your purchase!`
        );

        cart = [];
        updateCartUI();
        receiptModal.classList.remove("active");
    });
});

// ================= SEARCH =================
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
    );

    currentPage = 1;
    renderProducts(filteredProducts);
});

// ================= CATEGORY FILTER =================
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "All") {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(
                (product) => product.category === category
            );
        }

        currentPage = 1;
        renderProducts(filteredProducts);
    });
});

// ================= CLOSE MODAL =================
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ================= SCREEN RESIZE =================
window.addEventListener("resize", () => {
    productsPerPage = window.innerWidth <= 768 ? 10 : 14;
    currentPage = 1;
    renderProducts(filteredProducts);
});

// ================= LOAD PRODUCTS FROM BACKEND =================
async function init() {
    allProducts = await getProducts();
    filteredProducts = allProducts;
    renderProducts(filteredProducts);
}

// ================= SOUND SYSTEM =================
let hoverSound;
let clickSound;

window.addEventListener("DOMContentLoaded", () => {
    hoverSound = document.getElementById("hoverSound");
    clickSound = document.getElementById("clickSound");
});

let lastHover = 0;

function playHover() {
    const now = Date.now();
    if (now - lastHover > 80) {
        hoverSound.currentTime = 0;
        hoverSound.play();
        lastHover = now;
    }
}

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// APPLY HOVER
function applySounds() {
    const elements = document.querySelectorAll("a, button, .product, .card");

    elements.forEach(el => {
        el.addEventListener("mouseenter", playHover);
        el.addEventListener("click", playClick);
    });
}

// run after load
setTimeout(applySounds, 1000);

// fix autoplay restriction
document.addEventListener("click", () => {
    hoverSound.play().catch(()=>{});
    clickSound.play().catch(()=>{});
});

//hero section images slides
let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 4000);

loadCart();
init();
// ✅ LOAD CART ON PAGE LOAD
updateCartUI();