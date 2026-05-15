// ================= CART STORAGE =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= GET CART =================
export function getCart() {
    return cart;
}

// ================= ADD TO CART =================
export function addToCart(product, qty = 1) {

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || "",
            quantity: qty
        });
    }

    saveCart();
    updateCartUI();
}

// ================= REMOVE ITEM =================
export function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// ================= CHANGE QUANTITY =================
export function changeQuantity(id, type) {

    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (type === "increase") {
        item.quantity++;
    } else if (type === "decrease") {
        item.quantity--;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }

    saveCart();
    updateCartUI();
}

// ================= CLEAR CART =================
export function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// ================= UPDATE UI =================
export function updateCartUI() {

    const cartItemsContainer = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        totalItems += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">

                <div>
                    <strong>${item.name}</strong>
                    <p>$${item.price} × ${item.quantity}</p>
                </div>

                <div>
                    <button onclick="window.changeQty('${item.id}','decrease')">-</button>
                    <button onclick="window.changeQty('${item.id}','increase')">+</button>
                    <button onclick="window.removeItem('${item.id}')">X</button>
                </div>

                <div>$${item.price * item.quantity}</div>

            </div>
        `;
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = "Total: $" + total;
}

// ================= LOAD CART =================
export function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartUI();
}

// ================= GLOBAL FUNCTIONS (for buttons) =================
window.changeQty = (id, type) => changeQuantity(id, type);
window.removeItem = (id) => removeFromCart(id);