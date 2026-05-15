const API_URL = "http://localhost:4000/allproducts";

export async function getProducts() {
    try {
        const params = new URLSearchParams(window.location.search);
        const collection = params.get("collection");
        const isNew = params.get("new");

        const res = await fetch(API_URL);
        let data = await res.json();

        // filter by collection
        if (collection) {
            data = data.filter(p => p.collection === collection);
        }

        // filter new arrivals (last 7 days)
        if (isNew) {
            const now = new Date();
            data = data.filter(p => {
                const productDate = new Date(p.Date);
                const diffDays = (now - productDate) / (1000 * 60 * 60 * 24);
                return diffDays <= 7;
            });
        }

        return data.map(p => ({
            ...p,
            price: p.price || p.new_price,
            images: p.images && p.images.length
                ? p.images
                : (p.image ? [p.image] : [])
        }));

    } catch (error) {
        console.log("Error fetching products:", error);
        return [];
    }
}