const productId = new URL(window.location.href).searchParams.get("id");


getItem();

async function getProduct() {
    const product = await fetch(`http://localhost:3000/api/products/${productId}`)
    return await product.json();
}
    
async function getItem(){
    const product = await getProduct()
        .then((product) => {
            const productImg = document.createElement("img");
            document.querySelector(".item__img").appendChild(productImg);
            productImg.src = product.imageUrl;
            productImg.alt = product.altTxt;

            const productName = document.getElementById('title');
            productName.innerHTML = product.name;

            const productPrice = document.getElementById('price');
            productPrice.innerHTML = product.price;

            const productDescription = document.getElementById('description');
            productDescription.innerHTML = product.description;
                
            for (const colors of product.colors){
                const productColors = document.createElement("option");
                document.querySelector("#colors").appendChild(productColors);
                productColors.value = colors;
                productColors.innerHTML = colors;
            }
            addToCart(product);
    })
    .catch ((error) => {
        return error;
    });
}

function addToCart(product) {

    // Trouver le bouton "Ajouter au panier"
    const btn_addToCart = document.querySelector("#addToCart");
    
    // Evenement "click"
    btn_addToCart.addEventListener("click", ()=>{
        // condition : couleur definie et bonne quantité
        if (quantity.value > 0 && quantity.value <=100 && colors.value !== ""){
            product.colors=colors.value
            product.quantity=quantity.value

            // Test l'existence d'un panier 
            let productLocalStorage = JSON.parse(localStorage.getItem("cart"));
            if (productLocalStorage){

                // Test l'existence d'un même produit
                const findProduct = productLocalStorage.find((element) => element._id == product._id && element.colors == product.colors)
                if (findProduct){

                    // Rajouter la quantité du même produit dans le panier
                    const quantity = parseInt(findProduct.quantity) + parseInt(product.quantity)
                    findProduct.quantity = quantity
                } else {

                    // Ajouter un nouveau produit au panier 
                    Reflect.deleteProperty(product,"price");
                    productLocalStorage.push(product);
                }
            } else {

                // Créer un panier et ajouter le produit
                productLocalStorage = [];
                Reflect.deleteProperty(product,"price")
                productLocalStorage.push(product);
            }
            localStorage.setItem("cart", JSON.stringify(productLocalStorage));
        }
    })
}
    

 