// affichage du numéro de commande
function confirmation(){
    const id = document.getElementById("orderId");
    id.innerText = new URL(window.location.href).searchParams.get("id");
}
confirmation();