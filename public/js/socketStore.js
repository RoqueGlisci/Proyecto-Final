const socket = io();

const noProductsStore = document.querySelector("#no-products-store");
const cardsContainer = document.querySelector("#cards-container");


const renderCards = products => {
    console.log("socket store");
    if (products.length > 0) {
        noProductsStore.style.display = 'none';
        cardsContainer.innerHTML = '';
        products.forEach(product => {
            cardsContainer.innerHTML += `
            <div class="productos__contenido">
			        <img class="productos__imagen" src="${product.img}" alt="${product.name}"/>
			        <h3 class="productos__titulo">${product.name}</h3><br>
			        <h4 class="productos__precio">
			            <span>$</span> ${product.price}
	                </h4>
                <form action="/cart/add-to-cart/${product.id}" method="POST">
                    <input type="hidden" name="id" value="${product.id}">
                    <input type="hidden" name="name" value="${product.name}">
                    <input type="hidden" name="price" value=${product.price}>
                    <input type="hidden" name="img" value="${product.img}">
                    <button class="añadir-al-carrito button-card">
                        Añadir al carrito
                    </button>
                </form>
		    </div>
            `
        });
    } else {
        noProductsStore.style.display = 'block'
    }
}


socket.on('products', (products) => {
    renderCards(products);
})
