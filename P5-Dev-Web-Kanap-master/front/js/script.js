getItems();

// Récupération des produits depuis l'API
async function getProducts() {
    const products = await fetch("http://localhost:3000/api/products")
    return await products.json();
}

// Création de la liste des produits
async function getItems() {
    const products = await getProducts ()
    .then((products) => {
        for (const product in products) {

            const productLink = document.createElement("a");
            document.querySelector(".items").appendChild(productLink);
            productLink.href = `product.html?id=${products[product]._id}`;

            const productArticle = document.createElement("article");
            productLink.appendChild(productArticle);

            const productImg = document.createElement("img");
            productArticle.appendChild(productImg);
            productImg.src = products[product].imageUrl;
            productImg.alt = products[product].altTxt;

            const productName = document.createElement("h3");
            productArticle.appendChild(productName);
            productName.classList.add("productName");
            productName.innerHTML = products[product].name;

            const productDescription = document.createElement("p");
            productArticle.appendChild(productDescription);
            productDescription.classList.add("productDescription");
            productDescription.innerHTML = products[product].description;
        }
    })
    .catch ((error) => {
        return error;
    })
}