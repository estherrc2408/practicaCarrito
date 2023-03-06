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
    let countProducts = [];
    let totalPrice = 0;

    //***************************EVENTO de click
    document.addEventListener('click', ({ target }) => {
        console.log(target);
        if (target.matches('#buy')) {//si pulsamos al boton del carrito en el index
            visibleTable();//cambia la visibilidad de la tabla
        }
        if (target.matches('#back.index')) {
            location.href = 'index.html';
        }
        if (target.matches('.addProduct')) {
            addProduct(target.id);
        }

    })


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
        if (location.pathname = '/index.html') {
            buttonHeader.innerHTML = `el i no funciona`;
            buttonHeader.id = 'buy'

        } else if (location.pathname = '/carrito.html') {
            buttonHeader.innerHTML = 'Volver a todos los productos';
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
        arrayProducts.forEach(({ id, title, description, price, rating, images }) => {
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

            const buttonProd = document.createElement('BUTTON');
            buttonProd.innerHTML = `Add to cart`;
            buttonProd.className = 'addProduct';
            buttonProd.id = id;
            card.append(buttonProd);

            fragment.append(card);
        })
        cardContainer.append(fragment);
    }


    //pintar estrellas funcion
    const printStars = (rating) => {//siendo productos el array con todos los productos y su info
        console.log(rating);
        const divStars = document.createElement('DIV');
        divStars.id = 'stars';
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

    //pintar objetos en la tabla index
    const addProduct = async (idProd) => {
        let consult = await consulta();
        let allProducts = consult.respuesta.products;
        //buscamos en la API el id del objeto que hemos anadido al carro
        const obj = allProducts.find(({ id }) => id = idProd);
        obj.contador = null;
        console.log(obj);//si sale el objeto
        //buscamos si en el array de productos seleccionados ya existe el objeto que hemos metido al carrito
        const foundList = arraySelectedProducts.find(({ id }) => id = idProd);//deberia de encontrar un objeto si es que lo encuentraa
        console.log(foundList);
        if (foundList == undefined) {
            obj.contador = 1;
            arraySelectedProducts.push(obj);
            console.log(arraySelectedProducts);//va bien
        } else if (foundList != undefined) {//en caso de que si exista en la cesta tendremos que añadirle mas uno al contador 
            let contador = obj.contador + 1;
            obj.contador = contador;
            console.log(obj)
        }
        return obj;//el product sera el objeto al que han dado en el boton add to Card
    }
    const deleteProduct = () => {

    }

    //funcion visibilidad de la tabla
    const visibleTable = () => {
        tableIndex.classList.toggle('visible');
        console.log('visible');
    }

    //pintar botones para navegar entre los productos

    //----------------------------CARRITO.HTML
    //pintar tabla segun lo que haya almacenado en el localhost

    //pintar buy boton


    //*********LOCALHOST
    //SET
    /*function agregarLocal(prod) {
        localStorage.setItem('producto', JSON.stringify(prod));//sera subido en formato JSON {"id":"podN","nombre":"nombreproducto"
    }
    */
    const addLocal = (product) => {//siendo product un objeto 
        localStorage.setItem('producto', JSON.stringify(product));//
    }
    //GET
    /*
    function extraerLocal() {
        const arrayCesta = JSON.parse(localStorage.getItem('producto')) || [];
        let num = arrayCesta.lenght - 1;
        return arrayCesta[num];
    }
    
    
    //*************************funciones de todo
    */
    const init = () => {
        printHeaderButton();
        printCards();
    }
    init();
})//LOAD