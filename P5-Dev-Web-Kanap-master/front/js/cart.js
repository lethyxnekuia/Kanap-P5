let productLocalStorage = JSON.parse(localStorage.getItem("cart"));

// Récupération d'un produit depuis l'API
async function getProduct(id) {
  const product = await fetch(`http://localhost:3000/api/products/${id}`)
  return await product.json();
}


// Fonction pour afficher le panier
function getCart(){
    for(const product of productLocalStorage){
      // récupération du produit depuis l'API pour avoir son prix
        getProduct(product._id)
          .then((productCopy) => {
            const productArticle = `<article class="cart__item">
            <div class="cart__item__img">
              <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.colors}</p>
                <p>${productCopy.price}€</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article> `
          const article = document.createElement("article");
          document.querySelector("#cart__items").appendChild(article);
          article.innerHTML = productArticle;
        })
        .catch ((error) => {
          return error;
        });
      }
      
}
getCart();


// Affiche la quantité total et le prix total
function totalQuantity(){
    let totalQuantity = 0
    let totalPrice = 0
    for(const product of productLocalStorage){
      getProduct(product._id)
      .then((productCopy) => {
          totalQuantity += parseInt(product.quantity)
          totalPrice += parseInt(product.quantity)*productCopy.price
          document.querySelector("#totalQuantity").innerHTML = totalQuantity
          document.querySelector("#totalPrice").innerHTML = totalPrice
      })
      .catch ((error) => {
        return error;
      });
    }
}

totalQuantity();
// Suppression d'un item
function deleteItem(){ 
    const btnDelete = document.querySelectorAll(".deleteItem");
      for (const product in productLocalStorage){
          btnDelete[product].addEventListener("click", ()=>{
              productLocalStorage.splice(product,1)
              localStorage.setItem("cart", JSON.stringify(productLocalStorage));
              location.reload();
          })
      } 
}
setTimeout(deleteItem, 500);
// Changer la quantité d'un produit
function quantityItem(){ 
  const btnQuantity = document.querySelectorAll(".itemQuantity");
  for (const product in productLocalStorage){
    btnQuantity[product].addEventListener('change', ()=>{
          productLocalStorage[product].quantity=btnQuantity[product].value;
          localStorage.setItem("cart", JSON.stringify(productLocalStorage));
          totalQuantity();
          
      })
  } 
}
setTimeout(quantityItem, 500);
// régle RegExp du formulaire
function getForm() {
  const form = document.querySelector(".cart__order__form");
  let emailRegExp = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
  
  form.firstName.addEventListener('change', function() {
    firstNameErrorMsg.innerHTML = charRegExp.test(this.value) ? '' : 'Verifiez votre renseignement.';
  });
  
  form.lastName.addEventListener('change', function() {
    lastNameErrorMsg.innerHTML = charRegExp.test(this.value) ? '' : 'Verifiez votre renseignement.';
  });
  
  form.address.addEventListener('change', function() {
    addressErrorMsg.innerHTML = addressRegExp.test(this.value) ? '' : 'Verifiez votre adresse.';
  });
  
  form.city.addEventListener('change', function() {
    cityErrorMsg.innerHTML = charRegExp.test(this.value) ? '' : 'Verifiez votre ville.';
  });
  
  form.email.addEventListener('change', function() {
    emailErrorMsg.innerHTML = emailRegExp.test(this.value) ? '' : 'Verifiez votre email.';
  });
  }
getForm();



// Envoie du formulaire
function postForm(){
  const btn_commander = document.getElementById("order");


  // liste de tous les id des produits
  btn_commander.addEventListener("click", ()=>{
      let product_id = [];
      for (const i in productLocalStorage) {
          product_id.push(productLocalStorage[i]._id);
      }
      // Formulaire à envoyer à l'API
      const order = {
          contact : {
              firstName: document.getElementById('firstName').value,
              lastName: document.getElementById('lastName').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              email: document.getElementById('email').value,
          },
          products: product_id,
      } 
      // options pour poster sur l'API
      const options = {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
              'Accept': 'application/json', 
              "Content-Type": "application/json" 
          },
      };
      // Envoie à l'API
      fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        // Remplacer localStorage actuel par le numéro de commande
          localStorage.clear();
          // aller à la page confirmation
          document.location.href = `confirmation.html?id=${data.orderId}`;
      })
      .catch ((error) => {
        return error;
      });
      })
}
postForm();

