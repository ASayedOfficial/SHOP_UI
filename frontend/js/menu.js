// ================= MENU SYSTEM =================
document.addEventListener("DOMContentLoaded", async () => {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const closeMenu = document.getElementById("closeMenu");

    if (!menuBtn || !sideMenu || !closeMenu) return;

    menuBtn.addEventListener("click", () => {
        sideMenu.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        sideMenu.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            sideMenu.classList.remove("active");
        }
    });

    // ================= FETCH COLLECTIONS =================
    async function getCollections() {
        try {
            const res = await fetch("http://localhost:4000/collections");
            return await res.json();
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const collections = await getCollections();

    // ================= BUILD MENU =================
    const dropdownHTML = `
        <div class="menu-section">
            <h3>Collections</h3>
            ${collections.map(c => `
                <a href="index.html?collection=${c}">${c}</a>
            `).join("")}
        </div>

        <div class="menu-section">
            <h3>New Arrival</h3>
            ${collections.map(c => `
                <a href="index.html?collection=${c}&new=true">${c}</a>
            `).join("")}
        </div>
    `;

    sideMenu.innerHTML += dropdownHTML;
});