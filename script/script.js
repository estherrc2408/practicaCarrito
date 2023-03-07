document.addEventListener('DOMContentLoaded', () => {
    //querySelectors
    //index.html
    const headerButon = document.querySelector('.button-container');//si estamos en index.html pintara distintas cosas que en carrito.html
    const tableIndex = document.querySelector('.table-container-index');
    const bodyTable = document.querySelector('.shopping tbody');
    const cardContainer = document.querySelector('#grid-card-container');
    const buyButton = document.querySelector('#buy-button');
    const navButtons = document.querySelector('.button-nav-container');
    //carrito.html
    const tableContainer = document.querySelector('.table-container tbody');
    const table = document.querySelector('.shopping');
    //const buyButton = document.querySelector('#buy-button-container');

    const fragment = document.createDocumentFragment();

    //VARIABLES
    let arraySelectedProducts = [];
    let totalPrice = 0;

    //***************************EVENTO de click
    document.addEventListener('click', ({ target }) => {
        if (target.matches('#buy')) {//si pulsamos al boton del carrito en el index
            console.log(target);
            visibleTable();//cambia la visibilidad de la tabla
        }
        if (target.matches('#back.index')) {
            console.log(target);
            location.href = 'index.html';
        }
        if (target.matches('.addProduct')) {
            console.log(target);
            addProduct(target.id);//aqui se actualiza el local
            printIndexTable();//aqui se recoge el local y se pinta en la tabla

        }
        if (target.matches('.deleteProduct')){
            console.log(target);
            deleteProduct(target.id);
            printIndexTable();
        }
        if(target.matches('#buy-button')){
            console.log(target);
            //location.href='./carrito.html';
        }
    }


    )


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
            const card = document.createElement('DIV');
            card.className = 'grid-item';
            const divImg = document.createElement('DIV');
            const productImg = document.createElement('IMG');
            productImg.className='card-img';
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
        const divStars = document.createElement('DIV');
        divStars.id = 'stars';
        const emptyStar = '../img/star2.png';
        const fullStar = '../img/star1.png';
        for (let i = 0; i < Math.round(rating); i++) {
            const container = document.createElement('DIV');
            const star = document.createElement('img');
            star.src = fullStar;
            star.className='img-star';
            container.append(star);
            divStars.append(container);
        } for (let i = 0; i < 5 - Math.round(rating); i++) {
            const container = document.createElement('DIV');
            const star = document.createElement('img');
            star.src = emptyStar;
            container.append(star);
            divStars.append(container);
        }
        return divStars;
    }
    //pintar la tabla del index los objetos que anadan a la cesta o en su defecto actualizarlos
    const printIndexTable = () => {//si no pasamos un id a la funcion pinta lo del localStorage nada mas inicial la pagina
        bodyTable.innerHTML = '';
        let arrayLocal = getLocal();
        console.log(arrayLocal);
        if (arrayLocal.length != 0) {
            arrayLocal.forEach(({ id, images, title, price, contador }) => {
                const row = document.createElement('TR');
                row.id = id;

                const tdImage = document.createElement('TD');
                const divthumb = document.createElement('div');
                divthumb.className='thumb';
                const imageThumb = document.createElement('IMG');
                imageThumb.src = images[4];
                imageThumb.className='thumb';
                divthumb.append(imageThumb);
                tdImage.append(divthumb);
                const emptyTD = document.createElement('TD');

                const tdName = document.createElement('TD');
                tdName.textContent = title;

                const tdPrice = document.createElement('TD');
                tdPrice.textContent = price;

                const tdQuantity = document.createElement('TD');
                tdQuantity.textContent = contador;

                const tdLess = document.createElement('TD');
                const lessButton = document.createElement('BUTTON');
                lessButton.className = 'deleteProduct';
                lessButton.id = id;
                lessButton.textContent = '-';
                tdLess.append(lessButton);

                const tdMore = document.createElement('TD');
                const moreButton = document.createElement('BUTTON');
                moreButton.className = 'addProduct';
                moreButton.id = id;
                moreButton.textContent = '+';
                tdMore.append(moreButton);

                const tdSubtotal = document.createElement('TD');
                tdSubtotal.innerHTML = `${price}$ * ${contador} = ${price * contador}`;
                row.append(emptyTD, tdImage, tdName, tdPrice, tdLess, tdQuantity, tdMore, tdSubtotal)
                fragment.append(row);
            })
            bodyTable.append(fragment);

        }
        //en caso de que si pasemos id, sera porque se ha pulsado un boton de add o delete y tenemos repintar la tabla con el local actualizado, bajamos el local y lo pintamos

    }

    //pintar objetos en la tabla index
    const addProduct = async (idProd) => {
        let consult = await consulta();
        let allProducts = consult.respuesta.products;
        //buscamos en la API el id del objeto que hemos anadido al carro
        console.log(allProducts);
        let obj = allProducts.find((prod) => prod.id == idProd);
        console.log('id del obj seleccionado' + obj.id);//si sale el objeto
        //buscamos si en el array de productos seleccionados ya existe el objeto que hemos metido al carrito
        const foundList = arraySelectedProducts.find((prods) => prods.id == obj.id);//deberia de encontrar un objeto si es que lo encuentra
        console.log(foundList);
        if (foundList == undefined) {
            obj.contador = 0;
            obj.contador++;//si no encuentra el elemento en la lista de seleccionados, anade al objeto una nueva propiedad llamada contador y le da el valor de 1
            arraySelectedProducts.push(obj);
            setLocal();
            console.log('anadido obj al array' + arraySelectedProducts);//va bien
        } else if (foundList != undefined) {//en caso de que si exista en la cesta un producto de minmo indice tendremos que añadirle mas uno al contador 
            foundList.contador++;
            console.log('+1 contador');
            setLocal();
        }
        console.log(arraySelectedProducts);
    }

    const deleteProduct = async (idProd) => {
        const foundList = arraySelectedProducts.find((prods) => prods.id == idProd);
        foundList.contador--;
        console.log(foundList);
        if (foundList.contador > 0) {//si el id del producto está en nuestra cesta, le restamos uno a su contador
            let index = arraySelectedProducts.findIndex((prod) => {            //buscamos el indice dentro del array de productos que tenga el mismo id que el que acaban de quitar de la cesta
                if (prod.id == foundList.id) {
                    return true;
                }
            });
            if (index != -1) {
                arraySelectedProducts[index] = foundList;
                setLocal();
            }
            console.log(arraySelectedProducts);
        } else if (foundList.contador = 0) {
            arraySelectedProducts.splice(index,1)
            setLocal();
        }

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
    const setLocal = () => {//objeto producto
        console.log('seteando local ')
        localStorage.setItem('products', JSON.stringify(arraySelectedProducts));//convierte un objeto a string
    }
    //GET
    const getLocal = () => {
        return JSON.parse(localStorage.getItem('products')) || [];//recuperar nuesto array de objetos y convertirlo en un array
    }

    const init = () => {
        if(location.pathname='/index.html'){
        printIndexTable();
        printHeaderButton();
        printCards();
    }
    else if(location.pathname='/carrito.html'){
        printHeaderButton();
        printIndexTable();
    }}
    init();
})//LOAD