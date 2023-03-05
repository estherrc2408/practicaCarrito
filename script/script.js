document.addEventListener('DOMContentLoaded', () => {
    //querySelector
    //index.html
    const headerButon = document.querySelector('.button-container');//si estamos en index.html pintara distintas cosas que en carrito.html
    const tableIndex = document.querySelector('.table-container-index');
    const cardContainer = document.querySelector('#grid-card-container');
    const navButtons = document.querySelector('.button-nav-container');
    //carrito.html
    const tableContainer = document.querySelector('.table-container tbody');
    const table = document.querySelector('.shopping');
    const buyButton = document.querySelector('#buy-button-container');

    const fragment = document.createDocumentFragment();

    //VARIABLES
    let arraySelectedProducts = [];
    let totalPrice = 0;

    //***************************EVENTO de click



    //**************************LLAMADA A LA API NOTA: enlace: https://dummyjson.com/products
    const url = 'https://dummyjson.com/products';
    const consulta = async (id) => {
        try {
            let peticion;
            if (!id) {//un solo elemento
                peticion = await fetch(url)//peticion sera a todos los productos si el id del producto que pedimos no existe
            } else {
                peticion = await fetch(`${url}/${id}`);//si id si que existe nos mandara la info del producto concreto
            }
            if (peticion.ok) {//si el ok es true se hace la conversion con los datos pedidos
                const respuesta = await peticion.json();
                console.log(respuesta);
                return {
                    ok: true,
                    respuesta
                }
            } else {
                throw {
                    ok: false,
                    msg: 'problemas al cargar la API'
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    //crear funcion para que 

    //***************PINTAR
    /*----------BOTH
    pintar boton header <i class="fa-thin fa-cart-shopping"></i> icono
    lo pinta segun la url,
    si la url es index pinta el icono y al pulsarlo sale la tabla
    si la url es carrito.html pinta un boton que al pulsarlo nos lleva al index
    */
    const printHeaderButton = () => {
        const buttonHeader = document.createElement('button');
        if(location.pathname='/index.html'){
        buttonHeader.innerHTML=`<i class="fa-thin fa-cart-shopping"></i>`
        buttonHeader.id = 'buy'

        }else if(location.pathname='/carrito.html'){
        buttonHeader.innerHTML='Volver a todos los productos';
        buttonHeader.id = 'back-index'

        }
        headerButon.append(buttonHeader);
    }

    //----------------------------INDEX
    //pintar cards NOTA: icono estrellas <i class="fa-thin fa-star"></i>
    const printCards = async () => {
        let allProducts = await consulta();
        console.log(allProducts);//{ok:true respuesta:objeto}
        const arrayProducts = allProducts.respuesta.products;//los productos vienen en un array, son un total de 30
        console.log(arrayProducts);
        //tres primeros
        arrayProducts.forEach(({ title, description, price, rating, images }) => {
            console.log(title, description, price);

            const card = document.createElement('DIV');
            const divImg = document.createElement('DIV');
            const productImg = document.createElement('IMG');
            productImg.src = images[0];
            divImg.append(productImg);
            card.append(divImg);

            const divInfo = document.createElement('div');
            const titleProduct = document.createElement('H4');
            titleProduct.innerHTML = `${title} &nbsp <span>${price}$</span>`;
            const descriptionProduct = document.createElement('P');
            descriptionProduct.textContent = description;
            divInfo.append(titleProduct, descriptionProduct);
            card.append(divInfo);

            card.append(printStars(rating));

            fragment.append(card);
        })
    cardContainer.append(fragment);
}

    
//pintar estrellas funcion
const printStars =(rating) => {//siendo productos el array con todos los productos y su info
    console.log(rating);
    const divStars = document.createElement('DIV');
    const container1 = document.createElement('DIV');
    const container2 = document.createElement('DIV');
    const container3 = document.createElement('DIV');
    const container4 = document.createElement('DIV');
    const container5 = document.createElement('DIV');
    const star1 = document.createElement('img');
    const star2 = document.createElement('img');
    const star3 = document.createElement('img');
    const star4 = document.createElement('img');
    const star5 = document.createElement('img');
    const emptyStar = '../img/star2.png';
    const fullStar = '../img/star1.png';
    if (rating < 1) {
        star1.src = emptyStar;
        star2.src = emptyStar;
        star3.src = emptyStar;
        star4.src = emptyStar;
        star5.src = emptyStar;
    } else if (rating < 2 && rating > 1) {
        star1.src = fullStar;
        star2.src = emptyStar;
        star3.src = emptyStar;
        star4.src = emptyStar;
        star5.src = emptyStar;
    } else if (rating < 3 && rating > 2) {
        star1.src = fullStar;
        star2.src = fullStar;
        star3.src = emptyStar;
        star4.src = emptyStar;
        star5.src = emptyStar;
    } else if (rating < 4 && rating > 3) {
        star1.src = fullStar;
        star2.src = fullStar;
        star3.src = fullStar;
        star4.src = emptyStar;
        star5.src = emptyStar;
    } else if (rating < 5 && rating > 4) {
        star1.src = fullStar;
        star2.src = fullStar;
        star3.src = fullStar;
        star4.src = fullStar;
        star5.src = emptyStar;
    } else if (rating = 5) {
        star1.src = fullStar;
        star2.src = fullStar;
        star3.src = fullStar;
        star4.src = fullStar;
        star5.src = fullStar;
    }
    divStars.append(container1, container2, container3, container4, container5);
    container1.append(star1);
    container2.append(star2);
    container3.append(star3);
    container4.append(star4);
    container5.append(star5);
    return divStars;
}

//pintar tabla index, aparece y se esconde al pulsar en el boton del header, usar toggle
const printTableIndex = () =>{
    
}

//pintar botones para navegar entre los productos

//----------------------------CARRITO.HTML
//pintar tabla segun lo que haya almacenado en el localhost

//pintar buy boton


//*********LOCALHOST
//GET
/*
function extraerLocal() {
    const arrayCesta = JSON.parse(localStorage.getItem('producto')) || [];
    let num = arrayCesta.lenght - 1;
    return arrayCesta[num];
}
//SET
function agregarLocal(prod) {
    localStorage.setItem('producto', JSON.stringify(prod));//sera subido en formato JSON {"id":"podN","nombre":"nombreproducto"
}
*/
//*************************funciones de todo

const init = () => {
    printHeaderButton();
    printCards();
}
init();
})//LOAD