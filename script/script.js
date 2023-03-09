document.addEventListener('DOMContentLoaded', () => {
    //querySelectors
    //index.html
    const headerButon = document.querySelector('.button-container');//si estamos en index.html pintara distintas cosas que en carrito.html
    const tableIndex = document.querySelector('.table-container-index');
    const bodyTable = document.querySelector('.shopping tbody');
    const cardContainer = document.querySelector('#grid-card-container');
    const buyButton = document.querySelector('#buy-button');
    const navButtons = document.querySelector('#button-nav-container');
    const insertTotal = document.querySelector('#insert-total-td');
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
            console.log('deberia haber pintado');
        }
        if (target.matches('.deleteProduct')) {
            console.log(target);
            deleteProduct(target.id);
            printIndexTable();
        }
        if (target.matches('#buy-button')) {
            console.log(target);
            location.href='../carrito.html';
            //location.href='./carrito.html';
        }
        if (target.matches('.page-button')) {//id botones=num pagina, class botones=page-button
            console.log(target);
            printCards(target.id);
        }
    })


    //**************************LLAMADA A LA API NOTA: enlace: https://dummyjson.com/products
    const limit = 9;
    const consulta = async (id, skip) => {
        let url;
        try {
            if (id) {
                url = `https://dummyjson.com/products/${id}`;
            } else if (!skip) {//si no hay limite ni skip
                url = `https://dummyjson.com/products?limit=${limit}&skip=0`;
            } else if (skip) {
                url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
            }
            console.log(url);
            let peticion = await fetch(url);
            if (peticion.ok) {//si el ok es true se hace la conversion con los datos pedidos
                let respuesta = await peticion.json();
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
    const printCards = async (actualPage) => {//consulta(prudporpag,salto de elementos,id)
        //let numTotalProducts = arrayProducts.length;
        cardContainer.innerHTML = '';
        let waitProducts;
        if (actualPage == undefined) {
            actualPage = 1;
            waitProducts = await consulta(undefined,);//9,(actualPage-1)*9)
        } else {
            waitProducts = await consulta(undefined, (actualPage - 1) * 9)
            console.log(waitProducts);
        }
        const visibleProducts = waitProducts.respuesta.products;
        const totalProducts = waitProducts.respuesta.total;
        printPageButtons(totalProducts);
        visibleProducts.forEach(({ id, title, description, price, rating, images }) => {
            const card = document.createElement('DIV');
            card.className = 'grid-item';
            const divImg = document.createElement('DIV');
            const productImg = document.createElement('IMG');
            productImg.className = 'card-img';
            productImg.src = images[0];
            divImg.append(productImg);
            card.append(divImg);

            const divInfo = document.createElement('div');
            const titleProduct = document.createElement('H4');
            titleProduct.innerHTML = `${title} &nbsp <span>${price}$</span>`;
            const descriptionProduct = document.createElement('P');
            descriptionProduct.className = 'texto-ajustado';
            descriptionProduct.textContent = description;
            divInfo.append(titleProduct, descriptionProduct);
            card.append(divInfo);

            card.append(printStars(rating));

            const divCardButton = document.createElement('DIV');
            divCardButton.classList = 'button-container-class';
            const buttonProd = document.createElement('BUTTON');
            divCardButton.append(buttonProd);
            buttonProd.innerHTML = `Add to cart`;
            buttonProd.className = 'addProduct';
            buttonProd.id = id;
            card.append(divCardButton);

            fragment.append(card);
        })
        cardContainer.append(fragment);
    }

    const printPageButtons = (total) => {
        navButtons.innerHTML = '';
        let pages = parseInt(total / 9);
        let rest = total % 9;
        if (rest != 0) {
            pages = pages + 1;
        }
        for (let i = 1; i <= pages; i++) {
            const navButton = document.createElement('BUTTON');
            navButton.className = 'page-button';
            navButton.textContent = `${i}`;
            navButton.id = i
            navButtons.append(navButton);
        }
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
            star.className = 'img-star';
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
    const printIndexTable = async () => {//si no pasamos un id a la funcion pinta lo del localStorage nada mas inicial la pagina
        bodyTable.innerHTML = '';
        let arrayLocal = await getLocal();
        console.log(arrayLocal);
        let arraysubtotales = [];
        let total = 0;
        if (arrayLocal.length != 0) {
            arrayLocal.forEach(({ id, images, title, price, contador }) => {
                const row = document.createElement('TR');
                row.id = id;

                const tdImage = document.createElement('TD');
                const divthumb = document.createElement('div');
                divthumb.className = 'thumb';
                const imageThumb = document.createElement('IMG');
                imageThumb.src = images[4];
                imageThumb.className = 'thumb';
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
                let subtotal = price * contador;
                tdSubtotal.innerHTML = `${price * contador}`;
                row.append(emptyTD, tdImage, tdName, tdPrice, tdLess, tdQuantity, tdMore, tdSubtotal)
                fragment.append(row);

                arraysubtotales.push(subtotal);
            })
            for (let i = 0; i < arraysubtotales.length; i++) {
                total += arraysubtotales[i];
            }
            bodyTable.append(fragment);
            console.log(total)

            const tdTotal = document.createElement('TD');
            insertTotal.innerHTML = `
            <td><button id="buy-button">BUY</button></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>TOTAL</td>
            <td>${total}</td>`
        }
        //en caso de que si pasemos id, sera porque se ha pulsado un boton de add o delete y tenemos repintar la tabla con el local actualizado, bajamos el local y lo pintamos

    }

    //pintar objetos en la tabla index
    const addProduct = async (idProd) => {
        let consult = await consulta(idProd, null);//busca el producto concreto por id
        let theProduct = consult.respuesta;//nos da un objeto concreto
        //buscamos si en el array de productos seleccionados ya existe el objeto que hemos metido al carrito
        arraySelectedProducts = getLocal();
        const foundList = arraySelectedProducts.find(({ id }) => id == theProduct.id);//deberia de encontrar un objeto si es que lo encuentra
        console.log(arraySelectedProducts);
        console.log(foundList);
        if (foundList == undefined) {
            theProduct.contador = 0;
            theProduct.contador++;//si no encuentra el elemento en la lista de seleccionados, anade al objeto una nueva propiedad llamada contador y le da el valor de 1
            arraySelectedProducts.push(theProduct);
            setLocal();//sube el arraySelectedProducts al local
            console.log('anadido obj al array');//va bien
        } else if (foundList != undefined) {//en caso de que si exista en la cesta un producto de minmo indice tendremos que añadirle mas uno al contador 
            foundList.contador++;
            console.log('+1 contador');
            setLocal();
        }
        arraySelectedProducts = getLocal();
        console.log(arraySelectedProducts);
    }

    const deleteProduct = async (idProd) => {
        arraySelectedProducts = getLocal();
        const foundList = arraySelectedProducts.find((prods) => prods.id == idProd);
        foundList.contador--;
        console.log(foundList);
        let index = arraySelectedProducts.findIndex((prod) => {
            if (prod.id == foundList.id) {
                return true;
            }
        })
        if (foundList.contador > 0) {//si el id del producto está en nuestra cesta, le restamos uno a su contador
            if (index != -1) {
                arraySelectedProducts[index] = foundList;
                setLocal();
            }
            console.log(arraySelectedProducts);
        } else if (foundList.contador < 1 || null) {

            arraySelectedProducts.splice(index, 1)
            console.log(arraySelectedProducts);
            setLocal();
        }
        arraySelectedProducts = getLocal();
    }

    //funcion visibilidad de la tabla
    const visibleTable = () => {
        tableIndex.classList.toggle('visible');
        console.log('visible');
    }

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
        if (location.pathname = '/index.html') {
            printIndexTable();
            printHeaderButton();
            printCards();
        }
        else if (location.pathname = '/carrito.html') {
            printHeaderButton();
            printIndexTable();
        }
    }
    init();
})//LOAD