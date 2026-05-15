import { getProducts } from "./products.js";
import { addToCart } from "./cart.js";

const box = document.getElementById("productDetails");

// fix image path
function fixImage(img) {
    if (!img) return "images/no-image.png";
    if (img.startsWith("http")) return img;
    return "http://127.0.0.1:4000/images/" + img;
}

// get all images
function getImages(product) {
    if (product.images && product.images.length) return product.images;
    if (product.image) return [product.image];
    return ["images/no-image.png"];
}

// quantity
let quantity = 1;

async function loadProduct() {

    const id = new URLSearchParams(window.location.search).get("id");
    const products = await getProducts();

    const product = products.find(p => String(p._id || p.id) === id);

    if (!product) {
        box.innerHTML = "<h2>Product not found</h2>";
        return;
    }

    const images = getImages(product).map(fixImage);

    const colors = product.colors || ["Red", "Black", "Blue"];

    // 🔥 HTML ONLY (NO JS INSIDE)
    box.innerHTML = `
    <div class="single-product-page">

        <!-- LEFT -->
        <div class="product-left">

            <img id="mainImage" src="${images[0]}" class="main-product-img">

            <div class="thumbnail-container">
                ${images.map(img => `
                    <img src="${img}" class="thumb-img">
                `).join("")}
            </div>

        </div>

        <!-- RIGHT -->
        <div class="product-right">

            <h1>${product.name}</h1>

            <h2>
                <span style="text-decoration:line-through;color:#999;">
                    ${product.old_price ? "$" + product.old_price : ""}
                </span>

                <span style="color:#d86b98;margin-left:10px;">
                    $${product.new_price || product.price}
                </span>
            </h2>

            <p>${product.description || ""}</p>

            <!-- COLORS -->
            <div class="section">
                <h3>Color</h3>
                <div class="color-options">
                    ${colors.map(c => `
                        <button class="color-btn">${c}</button>
                    `).join("")}
                </div>
            </div>

            <!-- QUANTITY -->
            <div class="section">
                <h3>Quantity</h3>

                <div class="qty-box">
                    <button id="decBtn">-</button>
                    <span id="qty">1</span>
                    <button id="incBtn">+</button>
                </div>
            </div>

            <!-- DETAILS -->
            <div class="section">
                <p><b>Category:</b> ${product.category}</p>
                <p><b>Brand:</b> ${product.brand || "-"}</p>
                <p><b>Stock:</b> ${product.stock}</p>
                <p><b>Rating:</b> ⭐ ${product.rating || 0}</p>
                <p>${product.details || ""}</p>
            </div>

            <button id="addCartBtn">Add To Cart</button>

        </div>
    </div>
    `;

    // ================= EVENTS (REAL FIX) =================

    // thumbnail click
    const thumbs = document.querySelectorAll(".thumb-img");
    const mainImage = document.getElementById("mainImage");

    thumbs.forEach(img => {
        img.addEventListener("click", () => {
            mainImage.src = img.src;
        });
    });

    // quantity buttons
    document.getElementById("incBtn").onclick = () => {
        quantity++;
        document.getElementById("qty").innerText = quantity;
    };

    document.getElementById("decBtn").onclick = () => {
        if (quantity > 1) quantity--;
        document.getElementById("qty").innerText = quantity;
    };

    // add to cart
    document.getElementById("addCartBtn").addEventListener("click", () => {

        const productData = {
            id: product.id || product._id,
            name: product.name,
            price: product.new_price || product.price,
            image: images[0]
        };

        addToCart(productData, quantity);

        alert("Added to cart!");
    });

}

loadProduct();