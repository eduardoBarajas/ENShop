$(document).ready(e => {
    // se puede saber si la pagina esta siendo recargada
    // Animations initialization
    new WOW().init();
    // reemplazar los urls que tiene el token para quitarlo
    if (window.location.href.includes('?'))
        window.history.replaceState(null, '', window.location.href.split('?')[0]);
    // si existe una sesion con el carrito se obtiene la cantidad de articulos que tiene.
    if (sessionStorage.getItem('CartSession') != null) {
        $.ajax({
            url: '/Carts/idCart/' + sessionStorage.getItem('CartSession'),
            type: 'GET',
            success: function (data, status) {
                if (status !== 'nocontent') {
                    $('#carrito_badge').text(parseInt(data));
                } else {
                    $('#carrito_badge').text('0');
                }
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 0 || jqXHR.status == 500) {
                $('#carrito_badge').text('0');
                console.log('Error 500 fallo el servidor', errorThrown);
            }
        });
    } else {
        $('#carrito_badge').text('0');
    }

    // Si existe una sesion de usuario entonces se configuran los boton segun el caso.
    if (localStorage.getItem('userSession') !== null) {
        if (JSON.parse(localStorage.getItem('userSession'))['token'] != null) {
            document.getElementById('btnAdmin').style.display = 'block';
            document.getElementById('btnPedidosAdmin').style.display = 'block';
        }
        document.getElementById('btnLogin').style.display = 'none';
        document.getElementById('btnLogout').style.display = 'block';
        const date = new Date();
        const dateExpires = new Date(JSON.parse(localStorage.getItem('userSession'))['expire']);
        if (date > dateExpires) {
            logout();
        }
    } else {
        if (document.getElementById('btnLogin') !== null) {
            document.getElementById('btnLogin').style.display = 'block';
            document.getElementById('btnLogout').style.display = 'none';
        }
    }
});

// Configuracion Firebase
var firebaseConfig = {
    apiKey: "AIzaSyB1LKzSELcOuXiHRhdxY2fXecKyaRotM6Y",
    authDomain: "codens-18ad2.firebaseapp.com",
    databaseURL: "https://codens-18ad2.firebaseio.com",
    projectId: "codens-18ad2",
    storageBucket: "codens-18ad2.appspot.com",
    messagingSenderId: "311440713794",
    appId: "1:311440713794:web:07f8926444234a20"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Al cerrar sesion se debe limpiar la sesion actual.
function logout() {
    document.getElementById('btnLogout').style.display = 'none';
    document.getElementById('btnLogin').style.display = 'block';
    document.getElementById('btnAdmin').style.display = 'none';
    document.getElementById('btnPedidosAdmin').style.display = 'none';
    localStorage.removeItem('userSession');
    window.location.href = '/';
}

// Esta funcion sirve para entrar a las rutas que necesitan autenticacion.
function adminClick(route) {
    if (localStorage.getItem('userSession') !== null) {
        parent.location = `/Admin/${route}?token=${JSON.parse(localStorage.getItem('userSession'))['token']}`;
    }
}

// Funcion para definir el texto del modal
function openModal(options) {
    document.getElementById('botom-modal-body').innerText = options['body_text'];
    let btnCancel = document.getElementById('btn-cancel-modal');
    let btnAccept = document.getElementById('btn-accept-modal');
    let btnClose = document.getElementById('btn-close-modal');
    let modalContent = document.getElementById('bottom-modal-content');
    if (options['operation'] != null) {
        (options['operation'] === 'Success') ? modalContent.classList.add('content_modal_success') : modalContent.classList.add('content_modal_failed');
        btnCancel.style.display = 'none';
        btnAccept.style.display = 'none';
        btnClose.style.display = 'block';
        btnClose.classList.add('fadeIn');
    }
    if (options['choices'] != null) {
        btnCancel.attributes.removeNamedItem('data-dismiss');
        btnAccept.textContent = options['choices']['one'];
        btnCancel.textContent = options['choices']['two'];
        if (options['choices']['three'] != null) {
            btnClose.style = 'block';
            btnClose.textContent = options['choices']['three'];
            btnClose.attributes.removeNamedItem('data-dismiss');
            btnClose.classList.add('btn-color-green');
        }
    }
    if (options['colors'] != null) {
        btnAccept.classList.add(options['colors']['one']);
        btnCancel.classList.add(options['colors']['two']);
    }
    if (!$('#botom-modal').hasClass('show')) {
        $('#botom-modal').modal('toggle');
    }
    $('#botom-modal').on('hidden.bs.modal', function (e) {
        $('#btn-close-modal').attr('data-dismiss', 'modal');
        $('#btn-cancel-modal').attr('data-dismiss', 'modal');
        btnAccept.textContent = 'Continuar';
        btnCancel.textContent = 'Cancelar';
        btnClose.classList.remove('fadeIn');
        btnClose.classList.remove('btn-color-green');
        btnCancel.style.display = 'block';
        btnAccept.style.display = 'block';
        btnClose.style.display = 'none';
        if (options['colors'] != null) {
            btnAccept.classList.remove(options['colors']['one']);
            btnCancel.classList.remove(options['colors']['two']);
        }
        modalContent.classList.remove('content_modal_failed');
        modalContent.classList.remove('content_modal_success');
    });
}

/*

    ----INICIO----FUNCIONES PARA EL MODULO DE PRODUCTOS.

*/

// Variable global para almacenar las imagenes.
var IMAGES;

function initProductModule() {
    $(document).ready(function () {
        const ref = firebase.storage().ref();
        var action = '';
        (document.getElementById('product-holder') !== null) ? action = 'Edit' : action = 'Add';
        console.log(action);
        if (action === 'Edit') {
            var result = JSON.parse($('#product-holder').attr('value'));
            fillProductForm(result.response);
            console.log(result.response);
        } else {
            IMAGES = [undefined, undefined, undefined, undefined, undefined, undefined];
        }
        $("#btnAction").click(function () {
            openModal({ 'body_text': 'Seguro que quieres guardar los moviemientos de este producto?' });
        });
        $('#bestseller_btn').click(function () {
            setBtnBestSeller();
        });
        $('#btn-accept-modal').click(e => {
            var links_images = [];
            // se agrega el loader para mostrar que esta modificando
            $('#botom-modal-row').append('<div id="loader" class="lds-facebook mr-5"><div></div><div></div><div></div></div>');
            let num_images = 0;
            let num_total_images = 0;
            IMAGES.forEach(imagen => { if (imagen != undefined) num_total_images++; });
            console.log(num_total_images);
            IMAGES.forEach(image => {
                if (image != undefined) {
                    // si imagen es del tipo string entonces significa que ya esta almacenado y solo es link
                    if (typeof image !== "string") {
                        // var file_to_upload = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+imagen.name;
                        const task = ref.child(image.name).put(image);
                        task.then((snapshot) => {
                            ref.child(image.name).getDownloadURL().then((link) => {
                                links_images.push(link.substring(0, link.indexOf('?')));
                                num_images++;
                                if (num_images === num_total_images) {
                                    saveProduct(links_images, action);
                                }
                            });
                        });
                    } else {
                        // si entra aqui significa que es una imagen ya esta en la base de datos y  se tiene el link.
                        links_images.push(image);
                        num_images++;
                        if (num_images === num_total_images) {
                            saveProduct(links_images, action);
                        }
                    }
                }
            });
        });
    });
    const inputElement = document.getElementById("input");
    inputElement.addEventListener("change", handleFiles, false);
}


// Limipia el formulario
function cleanProductForm() {
    var inputElement = document.getElementById("input");
    inputElement.value = '';
    $('#images').empty();
    console.log(inputElement.files);
    IMAGES = [undefined, undefined, undefined, undefined, undefined, undefined];
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('state').value = '';
    document.getElementById('currentPrice').value = '';
    document.getElementById('originalPrice').value = '';
    document.getElementById('availableStock').value = '';
    document.getElementById('aditionalInfo').value = '';
    console.log(IMAGES);
    console.log($('#images'));
    console.log(inputElement);
}

// Esta funcion llena el formulario para editar los productos, recibe un producto como parametro.
function fillProductForm(product) {
    IMAGES = [undefined, undefined, undefined, undefined, undefined, undefined];
    (product.bestSeller === true) ? $('#bestseller_btn').data('seleccionado', 'NO') : $('#bestseller_btn').data('seleccionado', 'SI');
    setBtnBestSeller();
    document.getElementById('name').value = product.name;
    $('#name-label').addClass('active');
    document.getElementById('description').value = product.description;
    $('#description-label').addClass('active');
    document.getElementById('category').value = product.category;
    document.getElementById('state').value = product.state;
    document.getElementById('currentPrice').value = product.currentPrice;
    $('#currentPrice-label').addClass('active');
    document.getElementById('originalPrice').value = product.originalPrice;
    $('#originalPrice-label').addClass('active');
    document.getElementById('availableStock').value = product.availableStock;
    $('#availableStock-label').addClass('active');
    document.getElementById('aditionalInfo').value = product.aditionalInfo;
    $('#aditionalInfo-label').addClass('active');
    for (let x = 0; x < product.images.length; x++) {
        let arr = product.images[x].split('/');
        let nombre = '';
        arr.forEach(part => {
            if (part.includes('?alt=media')) {
                nombre = part.substring(0, part.indexOf('?alt=media'));
                if (nombre.length > 15)
                    nombre = nombre.substring(0, 10) + nombre.substring(nombre.length - 5, nombre.length);
            }
        });
        $('#images').append('<a id="' + x + '" onclick="deleteImage(this, true)" class="background-btn btn btn-outline-white waves-effect waves-light" target="_blank" role="button">' + nombre + '</a>');
        $('#' + x).hover(e => {
            $('#' + x).text('Eliminar Imagen');
        }, e2 => {
            $('#' + x).text(nombre);
        });
        IMAGES[x] = product.images[x];
    }
}

function saveProduct(links, action) {
    var name = document.getElementById('name').value;
    var productImages = [];
    links.forEach(image => {
        if (!image.includes('?alt=media')) {
            productImages.push(image += '?alt=media');
        } else {
            productImages.push(image);
        }
    });
    var bestSeller = 'NO';
    if (action === 'Edit') {
        bestSeller = $('#bestseller_btn').data('seleccionado');
    }
    var description = document.getElementById('description').value;
    var category = document.getElementById('category').value;
    var state = document.getElementById('state').value;
    var currentPrice = document.getElementById('currentPrice').value;
    var originalPrice = document.getElementById('originalPrice').value;
    var availableStock = document.getElementById('availableStock').value;
    var aditionalInfo = document.getElementById('aditionalInfo').value;
    var data = "availableStock=" + availableStock + '&name=' + name + '&description=' + description + '&category=' +
        category + '&state=' + state + '&currentPrice=' + currentPrice + '&originalPrice=' + originalPrice +
        '&aditionalInfo=' + aditionalInfo + '&images=' + productImages + "&bestSeller=" + bestSeller;
    let api_url;
    let request_type;
    if (action === 'Edit') {
        api_url = `/Products/Update/${window.location.href.split('/')[window.location.href.split('/').length - 1]}`;
        request_type = 'PUT';
    } else {
        api_url = `/Products/Save`;
        request_type = 'POST';
    }
    $.ajax({
        url: api_url,
        type: request_type,
        data: data,
        success: function (data, status) {
            if (status !== 'nocontent') {
                openModal({ 'body_text': 'Se modifico el producto con exito!.', 'operation': 'Success' });
            } else {
                openModal({ 'body_text': 'No modifico el producto, intentalo de nuevo.', 'operation': 'Failed' });
            }
            $('#loader').remove();
            $('#btn-close-modal').click(e => {
                if (action === 'Add') {
                    cleanProductForm();
                }
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                setTimeout(function () {
                    document.getElementById('name').focus();
                }, 750);
            });
            /*$('.modal').hide();
            $('.toast').toast('show');
            $('.toast').on('hidden.bs.toast', function () {
                
            });*/
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion con el servidor.', 'operation': 'Failed' });
        }
    });
}

function deleteImage(image, inDataBase) {
    $('#images').append('<div id="loader" class="lds-facebook ml-5"><div></div><div></div><div></div></div>');
    if (inDataBase) {
        console.log('esta en la base de datos');
        ref.child(IMAGES[image.id].split('/')[7].split('?')[0]).delete().then(function () {
            // File deleted successfully
            IMAGES[image.id] = undefined;
            $('#' + image.id).remove();
            $('#loader').remove();
        }).catch(function (error) {
            // Uh-oh, an error occurred!
            console.log('Algo malo paso' + error);
            IMAGES[image.id] = undefined;
            $('#' + image.id).remove();
            $('#loader').remove();
        });
    } else {
        IMAGES[image.id] = undefined;
        $('#' + image.id).remove('hide');
        $('#loader').remove();
    }
}

function setBtnBestSeller() {
    if ($('#bestseller_btn').data('seleccionado') == 'NO') {
        $('#bestseller_btn').text('SI');
        $('#bestseller_btn').data('seleccionado', 'SI');
        $('#bestseller_btn').removeClass('btn-secondary');
        $('#bestseller_btn').addClass('btn-primary');
    } else {
        $('#bestseller_btn').data('seleccionado', 'NO');
        $('#bestseller_btn').text('NO');
        $('#bestseller_btn').removeClass('btn-primary');
        $('#bestseller_btn').addClass('btn-secondary');
    }
}

function handleFiles() {
    for (let x = 0; x < 6; x++) {
        if (IMAGES[x] == undefined) {
            IMAGES[x] = this.files[0];
            $('#images').append('<a id="' + x + '" onclick="deleteImage(this, false)" class="background-btn btn btn-outline-white waves-effect waves-light" target="_blank" role="button">' + IMAGES[x].name + '</a>');
            $('#' + x).hover(e => {
                $('#' + x).text('Eliminar Imagen');
            }, e2 => {
                $('#' + x).text(IMAGES[x].name);
            });
            break;
        }
        if (x == 5) {
            alert('Ya eligiste el maximo de images, elimina una antes de intentar subir otra');
        }
    }
}

function initProductDetails(product) {
    console.log(product);
    $('#btnAddCart').click(e => {
        var quatityAvailable = parseInt($('#currentQuantity').text());
        console.log("cantidadDisponible: " + quatityAvailable + "  Cantidad Seleccionada: " + $('#quantity_form').val());
        if (quatityAvailable < $('#quantity_form').val() || quatityAvailable == 0 || $('#quantity_form').val() == 0) {
            openModal({ 'body_text': 'La cantidad que elegiste excede al stock que se tiene del producto!.', 'operation': 'Failed' });
        } else {
            if (sessionStorage.getItem('CartSession') == null) {
                $.ajax({
                    url: '/Carts/Generate',
                    type: 'GET',
                    success: function (data, status) {
                        var result = JSON.parse(data);
                        if (result.status === 'NotFound') {
                            sessionStorage.setItem('CartSession', result.response);
                            addOrder(product);
                        } else {
                            openModal({ 'body_text': 'No se pudo generar el identificador del carrito, intentalo mas tarde!.', 'operation': 'Failed' });
                        }
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 0 || jqXHR.status == 500) {
                        openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
                    }
                });
            } else {
                addOrder(product);
            }
        }

    });
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE PRODUCTOS.

*/

/*

    ----INICIO----FUNCIONES PARA EL MODULO DE PEDIDOS.

*/

function addOrder(product) {
    $.ajax({
        url: '/Orders/Save',
        type: 'POST',
        data: {
            idCart: sessionStorage.getItem('CartSession'),
            idProduct: product.id,
            quantity: Number($('#quantity_form').val()),
            unitaryPrice: product.currentPrice,
            completed: false
        },
        success: function (data, status) {
            if (status !== 'nocontent') {
                $('#carrito_badge').text(parseInt($('#carrito_badge').text()) + 1);
                $('#currentQuantity').text((parseInt($('#currentQuantity').text()) - $('#quantity_form').val()));
                openModal({ 'body_text': 'Se agrego el pedido con exito!.', 'operation': 'Success' });
            } else {
                openModal({ 'body_text': 'Ocurrio un problema al guardar el pedido!, por favor intenta de nuevo.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
        }
    });
}

/*

    ----CATALOGO----FUNCIONES PARA EL MODULO DE CATALOGO.

*/
var CATALOG_ROLE;
function initCatalogModule(role) {
    setCatalogRole(role);
    getAllCatalogProducts();
    // listerner para el modal que decide si eliminar o no el producto
    $('#btn-cancel-modal').click(e => {
        if (sessionStorage.getItem('selectedIdProduct') != null) {
            deleteProduct(sessionStorage.getItem('selectedIdProduct'));
        }
    });
    $('#btn-accept-modal').click(e => {
        if (sessionStorage.getItem('selectedIdProduct') != null) {
            window.location.href = '/ModificarProducto/id/' + sessionStorage.getItem('selectedIdProduct');
            sessionStorage.removeItem('selectedIdProduct');
        }
    });
    $('#btn-close-modal').click(e => {
        if (sessionStorage.getItem('selectedIdProduct') != null) {
            window.location.href = '/Producto/id/' + sessionStorage.getItem('selectedIdProduct');
            sessionStorage.removeItem('selectedIdProduct');
        }
    });
}

function setCatalogRole(role) {
    CATALOG_ROLE = role;
}

// funcion delete que tiene el modulo de admin de productos
function deleteProduct(idProduct) {
    const ref = firebase.storage().ref();
    $.ajax({
        url: '/Products/Delete/' + idProduct,
        type: 'DELETE',
        success: function (data, status) {
            if (status !== 'nocontent') {
                let deleted_images = 0;
                data.images.forEach(image => {
                    ref.child(image.split('/')[7].split('?')[0]).delete().then(function () {
                        // File deleted successfully
                        deleted_images++;
                        if (deleted_images === data.images.length) {
                            console.log('se eliminaron todas');
                        }
                    }).catch(function (error) {
                        // Uh-oh, an error occurred!
                        console.error(error);
                    });
                });
                openModal({ 'body_text': 'Se elimino el producto satisfactoriamente!.', 'operation': 'Success' });
                $('#prod_' + idProduct).remove();
            } else {
                openModal({ 'body_text': 'No se pudo puede eliminar, por que tiene pedidos pendientes!.', 'operation': 'Failed' });

            }
        }
    });
    sessionStorage.removeItem('selectedIdProduct');
}

function showProductAdminActionsModal(idProducto) {
    openModal({ 'body_text': 'Que quieres hacer con este producto?', 'choices': {'one': 'Editar', 'two': 'Eliminar', 'three': 'Ver'},
        'colors': {'one': 'btn-color-indigo', 'two': 'btn-color-red'}});
    sessionStorage.setItem('selectedIdProduct', idProducto);
}

function getAllCatalogProducts() {
    setCatalogSelectedOption('');
    $.ajax({
        url: '/Products/GetAll',
        type: 'GET',
        success: function (data, status) {
            if (status !== 'nocontent') {
                setCatalogProducts(data.response);
            } else {
                openModal({ 'body_text': 'No se encontraron productos en el sistema!.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
        }
    });
}

function searchProduct(event) {
    if ($('#search_input').val() == '') {
        getAllCatalogProducts();
        console.log('ENTRO AQUI');
    } else {
        $.ajax({
            url: '/Products/Search/' + $('#search_input').val(),
            type: 'GET',
            success: function (data, status) {
                setCatalogProducts(data.response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 0 || jqXHR.status == 500) {
                openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
            }
        });
    }
}

function getProductsByCategory(category) {
    $.ajax({
        url: '/Products/Category/' + category,
        type: 'GET',
        success: function (data, status) {
            console.log(data);
            if (status !== 'nocontent') {
                setCatalogSelectedOption(category);
                setCatalogProducts(data.response);
                $('#frameModalBottom').modal('toggle');

            } else {
                openModal({ 'body_text': `No se encontraron producto en el area de ${category}!.`, 'operation': 'Failed' });;
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
        }
    });
}

function setCatalogSelectedOption(category) {
    for (let x = 0; x < 6; x++) {
        if ($('#btn_opcion_' + (x + 1)).hasClass('active')) {
            $('#btn_opcion_' + (x + 1)).removeClass('active');
        }
    }
    switch (category) {
        case '': $('#btn_opcion_1').addClass('active'); break;
        case 'Ropa': $('#btn_opcion_2').addClass('active'); break;
        case 'Calzado': $('#btn_opcion_3').addClass('active'); break;
        case 'Electronicos': $('#btn_opcion_4').addClass('active'); break;
        case 'Electrodomesticos': $('#btn_opcion_5').addClass('active'); break;
        case 'Varios': $('#btn_opcion_6').addClass('active'); break;
    }
}

function setCatalogProducts(data) {
    var animationsSpeeds = ['', 'fast', 'slow', 'slower'];
    try {
        $('#products').empty();
        let elements;
        // counter y suma se usan para determinar la animacion que se usara en cada card individual.
        let counter = -1;
        let isSuma = true;
        for (let x = 0; x < data.length; x++) {
            // se comienza colocando el primer row.
            if (x === 0)
                elements = '<div class="row wow fadeIn w-100 mx-0" id="prod_' + data[x]._id + '">';
            // cada cuatro elementos se cerrara el row y se creara otro.
            if (x % 4 === 0 && x > 0) {
                elements += '</div>';
                elements += '<div class="row wow fadeIn w-100 mx-0" id="prod_' + data[x]._id + '">';
                if (counter !== 0) {
                    counter++;
                    isSuma = !isSuma;
                }
            }
            (isSuma) ? counter++ : counter--;
            let animation = 'animated bounceInUp ' + animationsSpeeds[counter];
            let priceRow = '';
            if (data[x].originalPrice === data[x].currentPrice) {
                priceRow = '<div class="col-12 col-md-12">';
            } else {
                priceRow = '<div class="col-6 col-md-6 px-0" style="background-color: tomato;"><p class="font-weight-bold white-text PrecioOriginal mt-1"><strong>Antes: </strong><small>' + data[x].originalPrice + '$</small></p></div><div class="col-6 col-md-6">';
            
            }
            if (CATALOG_ROLE === 'User') {
                elements += '<div class="' + animation + ' col-lg-3 col-md-3 mb-4"><div class="card shadow view"><div class="overlay"><img src="' + data[x].images[0] + '" class="card-img-top" alt=""> <span class="badge badge-pill danger-color w-75 text-right" style="background-color: #4CAF50!important;">' + data[x].state + '</span>';
                elements += '<a href="/Producto/id/' + data[x]._id + '"><div class="mask rgba-white-slight"></div></a></div><div class="card-body product-body py-2 text-center px-0">';
                elements += '<a href="/Producto/id/' + data[x]._id + '" class="product-name dark-grey-text">' + data[x].name;
                elements += '</a><div class="row">'+priceRow+'<h5 class="font-weight-bold green-text mt-1">';
                elements += '<strong>' + data[x].currentPrice + '$</strong></h5></div></div></div></div></div>';
            } else {
                /*elements += '<div class="' + animation + ' col-lg-3 col-md-3 mb-4"><div class="card"><div class="view overlay"><img id="img-' + data[x]._id + '" src="' + data[x].images[0] + '" class="card-img-top" alt=""><a href="/Producto/id/' + data[x]._id + '">';
                elements += '<div class="mask rgba-white-slight"></div></a></div><div class="card-body text-center"><h5><strong><a href="/Producto/id/' + data[x]._id + '" class="dark-grey-text">';
                elements += data[x].name + '<span class="mx-2 badge badge-pill danger-color">' + data[x].state + '</span></a></strong></h5><div class="row"><div class="col-md-6"><button id="btnEditar" onclick="parent.location=\'/ModificarProducto/id/' + data[x]._id + '\'" class="btn btn-primary btn-md btn-block mx-auto px-0"';
                elements += `type="button">Editar</button></div><div class="col-md-6"><button onclick="showDeleteModal('${data[x]._id}')" class="btn btn-primary btn-md btn-block mx-auto px-0" style="background-color: tomato!important;" type="button">`;
                elements += 'Eliminar</button></div></div></div></div></div>';*/
                elements += '<div class="' + animation + ' col-lg-3 col-md-3 mb-4"><div class="card shadow view"><div class="overlay"><img src="' + data[x].images[0] + '" class="card-img-top" alt=""> <span class="badge badge-pill danger-color w-75 text-right" style="background-color: #4CAF50!important;">' + data[x].state + '</span>';
                elements += `<a onclick="showProductAdminActionsModal('${data[x]._id}')"><div class="mask rgba-white-slight"></div></a></div><div class="card-body py-2 text-center px-0">`;
                elements += `<a onclick="showProductAdminActionsModal('${data[x]._id}')" class="product-name dark-grey-text">` + data[x].name;
                elements += '</a><div class="row">'+priceRow+'<h5 class="font-weight-bold green-text mt-1">';
                elements += '<strong>' + data[x].currentPrice + '$</strong></h5></div>  </div> </div></div></div>';
            }
        }
        
        $('#products').append(elements);
    } catch (e) { }
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE CATALOGO.

*/


/*

    ----INICIO----FUNCIONES PARA EL MODULO DE PEDIDOS.

*/
function initOrderDetails(idCart) {
    getCart(idCart);
}

function initOrdersList() {
    if (localStorage.getItem('userSession') !== null) {
        getCartsIdsFromUser(0, 6);
    }
    $('#btnSearchCart').click(e => {
        $('#pedidos-container').empty();
        getInfoFromCart($('#IdCart').val());
    });
}

function getCartsIdsFromUser(start, end) {
    $.ajax({
        url: `/Carts/Get/From/${start}/To/${end}/User/` + JSON.parse(localStorage.getItem('userSession'))['idUser'],
        type: 'GET',
        success: function (data, status) {
            console.log(data);
            if (status !== 'nocontent') {
                $('#pedidos-container').empty();
                setPaginationActions(data.cartsLength, 6, 'User');
                let counter = 0;
                data.carts.forEach(cart => {
                    getInfoFromCart(cart._id).done(e => {
                        counter++;
                        if (counter === data.carts.length) {
                            if (document.getElementById('content').attributes.getNamedItem('hidden') !== null) {
                                document.getElementById('content').attributes.removeNamedItem('hidden');
                            }
                            for (let x = 0; x < data.carts.length; x++) {
                                if (x % 2 === 0) {
                                    document.getElementById(`pedido_${data.carts[x]._id}`).classList.add('slideInLeft');
                                } else {
                                    document.getElementById(`pedido_${data.carts[x]._id}`).classList.add('slideInRight');
                                }
                                setTimeout(e => {
                                    document.getElementById(`pedido_${data.carts[x]._id}`).classList.remove('slideInRight');
                                    document.getElementById(`pedido_${data.carts[x]._id}`).classList.remove('slideInLeft');
                                }, 1000);
                            }
                        }
                    });
                });
            } else {
                $('#spacer-div').removeAttr('hidden');
                $('#content').attr('hidden', 'true');
                openModal({ 'body_text': 'No se han realizado pedidos aun!.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
        }
    });
}

function getInfoFromCart(id) {
    return $.ajax({
        url: '/Carts/id/' + id,
        type: 'GET',
        success: function (data, status) {
            console.log(data);
            if (status !== 'nocontent') {
                let state = '';
                if (data.sent)
                    state = 'COLOCADO';
                if (data.payed)
                    state = 'PAGADO';
                if (data.delivered)
                    state = 'ENVIADO';
                if (data.completed)
                    state = 'COMPLETADO';
                let link = '/Pedidos/id/';
                let node = `<div class="col-12 col-md-5 mx-2 my-2 animated" id="pedido_${id}"><a id="pedido_item_${data._id}" onclick="parent.location='${link}${data._id}'" data-toggle="collapse" class="shadow list-group-item list-group-item-action d-flex justify-content-between align-items-center">` +
                    `<div class="flex-column w-100">Cliente: ${data.name} ${data.lastNames}<p><small>Direccion Envio: ${data.address}, ${data.address2}, ${data.cp}, Ensenada, ` +
                    `B.C.</small></p><div class="row w-100"><div class="col-6 col-md-6"><small></small><span id="estado_pedido_${id}" class="badge badge-dark badge-pill">${state}</span> <small></div><div class="col-6 col-md-6">Realizado: </small><span id="created_${data._id}" class="badge badge-dark badge-pill">${data.creationDate}</span></div></div></div> `;
                $('#pedidos-container').append(node);
                $('#spacer-div').attr('hidden', 'true');
                $('#content').removeAttr('hidden');
            } else {
                $('#spacer-div').removeAttr('hidden');
                $('#content').attr('hidden', 'true');
                openModal({ 'body_text': 'No se encontro un pedido para ese codigo!.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con la conexion al servidor, intentalo de nuevo!.', 'operation': 'Failed' });
        }
    });
}

function setPaginationActions(length, size, role) {
    document.getElementById('pagination-links').innerHTML = '';
    if (length === 0) {
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    document.getElementById('pagination').style.display = 'block';
    for (let x = 0; x < length; x++) {
        if (x % size === 0) {
            let index = x;
            if (index === 0) {
                index = 1;
            } else {
                index = (index / size) + 1;
            }
            let node = document.createElement('li');
            node.classList.add('page-item');
            let childNode = document.createElement('a');
            childNode.classList.add('page-link');
            if (role === 'Admin') {
                childNode.setAttribute('onclick', `getAdminListCarts(${x}, ${x + size})`);
            } else {
                childNode.setAttribute('onclick', `getCartsIdsFromUser(${x}, ${x + size})`);
            }
            childNode.text = index.toString();
            node.appendChild(childNode);
            let parentNode = document.getElementById('pagination-links');
            parentNode.append(node);
        }
    }
}

function searchCart(event) {
    if ($('#IdCart').val() == '') {
        getCartsIdsFromUser(0, 6);
    }
}

function getCart(id) {
    console.log(id);
    $.ajax({
        url: '/Carts/GetOrders/Cart/' + id,
        type: 'GET',
        success: function (data, status) {
            console.log(data);
            if (status !== 'nocontent') {
                $.ajax({
                    url: '/Carts/id/' + id,
                    type: 'GET',
                    success: function (data, status) {
                        if (status !== 'nocontent') {
                            let datos = data.name + ' ' + data.lastNames;
                            datos += ', en la direccion ' + data.address + ', ' + data.address2 + ', ' + data.cp + ', Ensenada, B.C';
                            $('#datos_envio').text(datos);
                            if (data.sent)
                                $('#estado_actual').text('COLOCADO');
                            if (data.payed)
                                $('#estado_actual').text('PAGADO');
                            if (data.delivered)
                                $('#estado_actual').text('ENVIADO');
                            if (data.completed)
                                $('#estado_actual').text('COMPLETADO');
                        }
                    }
                });
                $('#pedidos_elements').empty();
                var total = 0;
                data.forEach(arr => {
                    $.ajax({
                        url: '/Orders/id/' + arr['id_order'],
                        type: 'GET',
                        success: function (result, status) {
                            console.log(result);
                            if (status !== 'nocontent') {
                                total += arr['product'].currentPrice * result['quantity'];
                                console.log(arr['product']);
                                elemento = '<li class="list-group-item d-flex justify-content-between lh-condensed">';
                                elemento += `<div class="container"><div class="row text-center"><div class="col-4 col-md-4"><div><h6 class="my-0">${arr['product'].name}</h6><small class="text-muted">Cantidad: x${result['quantity']}</small></div></div>`;
                                elemento += `<div class="col-5 col-md-5"><small class="text-muted">${arr['product'].description}</small></div><div class="col-3 col-md-3"><span class="text-muted">Precio Unitario: $${arr['product'].currentPrice}</span></div></li></div>`;
                                $('#pedidos_elements').append($(elemento));
                                $('#total_precio').text('$' + total);
                            } else {
                                openModal({ 'body_text': 'Ocurrio un problema al intentar obtener el producto, por favor intenta de nuevo.', 'operation': 'Failed' });
                            }
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 0 || jqXHR.status == 500) {
                            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                        }
                    });
                });
                console.log(total);
                $('#cantidad_productos_pedidos').text(data.length);
            } else {
                openModal({ 'body_text': 'No se encontro un pedido para ese codigo!.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE PEDIDOS.

*/

/*

    ----INICIO----FUNCIONES PARA EL MODULO DE CHECKOUT.

*/

function initCheckOutModule() {
    if (sessionStorage.getItem('CartSession') != null) {
        if (localStorage.getItem('userSession') != null) {
            fillUserInfo(JSON.parse(localStorage.getItem('userSession'))['idUser']);
        }
        getCheckOutCart(sessionStorage.getItem('CartSession'));
        $('#btnCompletar').click(e => {
            saveCart(sessionStorage.getItem('CartSession'));
        });
    }
}

function fillUserInfo(idUser) {
    $.ajax({
        url: '/Users/id/' + idUser,
        type: 'GET',
        success: function (res, status) {
            if (status !== 'nocontent') {
                let data = JSON.parse(res);
                $('#lastName').val(data.lastNames);
                $('#firstName').val(data.name);
                $('#email').val(data.email);
                $('#address').val(data.address);
                $('#zip').val(data.cp);
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

function saveCart(idCart) {
    let idUser = 'Invitado';
    if (localStorage.getItem('userSession') != null) {
        idUser = JSON.parse(localStorage.getItem('userSession'))['idUser'];
    }
    $.ajax({
        url: '/Carts/Save',
        type: 'POST',
        data: {
            id: idCart,
            idUser: idUser,
            name: $('#firstName').val(),
            lastNames: $('#lastName').val(),
            email: $('#email').val(),
            address: $('#address').val(),
            address2: $('#address-2').val(),
            cp: $('#zip').val()
        },
        success: function (datos, status) {
            if (status !== 'nocontent') {
                openModal({ 'body_text': 'Se agrego el pedido con exito.', 'operation': 'Success' });
                $('#botom-modal').on('hidden.bs.modal', function () {
                    sessionStorage.clear();
                    window.location = "/";
                });
            } else {
                openModal({ 'body_text': 'Hubo un problema al agregar el pedido, intenta de nuevo mas tarde.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

function getCheckOutCart(id) {
    $.ajax({
        url: '/Carts/GetOrders/Cart/' + id,
        type: 'GET',
        success: function (data, status) {
            if (status !== 'nocontent') {
                let total = 0;
                console.log(data);
                data.forEach(arr => {
                    total += arr['product'].currentPrice;
                    element = '<li id="element' + data.indexOf(arr) + '" class="list-group-item d-flex justify-content-between lh-condensed">';
                    element += '<div><h6 id="nombre' + data.indexOf(arr) + '" class="my-0">' + arr['product'].name + '</h6><small id="descripcion' + data.indexOf(arr) + '" class="text-muted">';
                    element += arr['product'].description + '</small></div><span><button id="btn_cancelar' + data.indexOf(arr) + '" style="background-color: tomato!important;opacity: 0" class="btn btn-secondary btn-md waves-effect m-0 w-100"  type="button">Cancelar</button></span><span id="precio' + data.indexOf(arr) + '" class="text-muted">$' + arr['product'].currentPrice + '</span></li>';
                    $(element).insertBefore('#promo_code');
                });
                $('#total_precio').text('$' + total);
                $('#cantidad_products_pedidos').text(data.length);
                $('#spacer-div').attr('hidden', 'true');
                $('#content').removeAttr('hidden');
                $('#content').css('display', 'none');
                $('#content').fadeIn(1000);
            } else {
                openModal({ 'body_text': 'Hubo un problema con el pedido, intenta de nuevo mas tarde.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE CHECKOUT.

*/

/*

    ----INICIO----FUNCIONES PARA EL MODULO DE CART.

*/

function initCartModule() {
    if (sessionStorage.getItem('CartSession') != null) {
        getCartOrders(sessionStorage.getItem('CartSession'));
    } else {
        $('#spacer-div').removeAttr('hidden');
        $('#content').attr('hidden', 'true');
    }
}

function getCartOrders(id) {
    console.log(id);
    $.ajax({
        url: '/Carts/GetOrders/Cart/' + id,
        type: 'GET',
        success: function (data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                $('#pedidos_elements').empty();
                let total = 0;
                data.forEach(arr => {
                    total += arr['product'].currentPrice;
                    element = '<li id="element' + data.indexOf(arr) + '" class="list-group-item d-flex justify-content-between lh-condensed">';
                    element += '<div><h6 id="nombre' + data.indexOf(arr) + '" class="my-0">' + arr['product'].name + '</h6><small id="descripcion' + data.indexOf(arr) + '" class="text-muted">';
                    element += arr['product'].description + '</small></div><span><button id="btn_cancelar' + data.indexOf(arr) + '" style="background-color: tomato!important;opacity: 0" class="btn btn-secondary btn-md waves-effect m-0 w-100"  type="button">Cancelar</button></span><span id="precio' + data.indexOf(arr) + '" class="text-muted">$' + arr['product'].currentPrice + '</span></li>';
                    $('#pedidos_elements').append(element);
                    $('#element' + data.indexOf(arr)).hover(hover => {
                        // se quitan las clases
                        $('#element' + data.indexOf(arr)).removeClass('paint-out');
                        $('#nombre' + data.indexOf(arr)).removeClass('paint-out');
                        $('#precio' + data.indexOf(arr)).removeClass('paint-out');
                        $('#descripcion' + data.indexOf(arr)).removeClass('paint-out');
                        $('#btn_cancelar' + data.indexOf(arr)).removeClass('fade-out');
                        // se ponen las clases
                        $('#element' + data.indexOf(arr)).addClass('paint-in');
                        $('#nombre' + data.indexOf(arr)).addClass('paint-in');
                        $('#precio' + data.indexOf(arr)).addClass('paint-in');
                        $('#precio' + data.indexOf(arr)).removeClass('text-muted');
                        $('#descripcion' + data.indexOf(arr)).addClass('paint-in');
                        $('#descripcion' + data.indexOf(arr)).removeClass('text-muted');
                        $('#btn_cancelar' + data.indexOf(arr)).addClass('fade-in');
                    }, unhover => {
                        $('#element' + data.indexOf(arr)).removeClass('paint-in');
                        $('#nombre' + data.indexOf(arr)).removeClass('paint-in');
                        $('#precio' + data.indexOf(arr)).removeClass('paint-in');
                        $('#descripcion' + data.indexOf(arr)).removeClass('paint-in');
                        $('#btn_cancelar' + data.indexOf(arr)).removeClass('fade-in');
                        // se ponen las clases
                        $('#element' + data.indexOf(arr)).addClass('paint-out');
                        $('#nombre' + data.indexOf(arr)).addClass('paint-out');
                        $('#precio' + data.indexOf(arr)).addClass('paint-out');
                        $('#precio' + data.indexOf(arr)).addClass('text-muted');
                        $('#descripcion' + data.indexOf(arr)).addClass('paint-out');
                        $('#descripcion' + data.indexOf(arr)).addClass('text-muted');
                        $('#btn_cancelar' + data.indexOf(arr)).addClass('fade-out');
                    });
                    $('#btn_cancelar' + data.indexOf(arr)).click(function () {
                        $.ajax({
                            url: '/Orders/Delete/' + arr['id_order'],
                            type: 'DELETE',
                            success: function (res, status) {
                                if (status !== 'nocontent') {
                                    $('#total_precio').text('$' + (parseFloat($('#total_precio').text().split('$')[1]) - arr['product'].currentPrice));
                                    $('#cantidad_products_pedidos').text(parseInt($('#cantidad_products_pedidos').text()) - 1);
                                    $('#element' + data.indexOf(arr)).remove();
                                } else {
                                    openModal({ 'body_text': 'Hubo un problema al eliminar el pedido, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                                }
                            }
                        })
                    });
                });
                $('#total_precio').text('$' + total);
                $('#cantidad_products_pedidos').text(data.length);
                $('#spacer-div').attr('hidden', 'true');
                $('#content').removeAttr('hidden');
                $('#content').css('display', 'none');
                $('#content').fadeIn(1000);
            } else {
                $('#spacer-div').removeAttr('hidden');
                $('#content').attr('hidden', 'true');
                $('#spacer-div').css('display', 'none');
                $('#spacer-div').fadeIn(1000);
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE CART.

*/

/*

    ----INICIO----FUNCIONES PARA EL MODULO DE ORDERS ADMIN.

*/
var operation = { operation: '', id: '' };
function initAdminOrdersModule() {
    $('#btn-accept-modal').click(e => {
        if (operation.operation === 'marcar_como') {
            $.ajax({
                url: '/Carts/Update/' + operation.id,
                type: 'PUT',
                data: {
                    state: $('#botom-modal-body').text().split(':')[1]
                },
                success: function (actualizado, status) {
                    if (status !== 'nocontent') {
                        $('#estado_pedido_' + operation.id).text($('#botom-modal-body').text().split(':')[1]);
                        console.log($('#estado_pedido_' + operation.id).text());
                        if ($('#botom-modal-body').text().split(':')[1] === 'COMPLETADO') {
                            $('#col-btn-marcar').remove();
                        } else {
                            $('#btnMarcar' + operation.id).text('MARCAR COMO ' + getNextState(getCurrentOrderStateFromText($('#botom-modal-body').text().split(':')[1])));
                        }
                        console.log('llego aqio');
                        openModal({ 'body_text': 'Se actualizo el pedido con exito.', 'operation': 'Success' });
                    } else {
                        openModal({ 'body_text': 'Hubo un problema al modificar el pedido, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                    }
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 0 || jqXHR.status == 500) {
                    openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                }
            });
        }
        if (operation.operation === 'cancelar') {
            $.ajax({
                url: '/Carts/Delete/' + operation.id,
                type: 'DELETE',
                success: function (data, status) {
                    if (status !== 'nocontent') {
                        $('#pedido_item_' + operation.id).fadeOut(1000, function () {
                            $('#pedido_item_' + operation.id).remove();
                        });
                        $('#collapsePedido' + operation.id).fadeOut(1000, function () {
                            $('#collapsePedido' + operation.id).remove();
                        });
                        openModal({ 'body_text': 'Se elimino el pedido con exito.', 'operation': 'Success' });
                    } else {
                        openModal({ 'body_text': 'No se pudo modificar el pedido.', 'operation': 'Failed' });
                    }
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 0 || jqXHR.status == 500) {
                    openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                }
            });
        }
    });
    getAdminListCarts(0, 4);
}


function getAdminListCarts(start, end) {
    $.ajax({
        url: `/Carts/Get/From/${start}/To/${end}/User/undefined`,
        type: 'GET',
        success: function (data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                setPaginationActions(data.cartsLength, 4, 'Admin');
                $('#pedidos_list').empty();
                $('#pedidos_elements').empty();
                data.carts.forEach(cart => {
                    let node = `<a id="pedido_item_${cart._id}" data-toggle="collapse" href="#collapsePedido${cart._id}" class="animated fast slideInLeft shadow list-group-item list-group-item-action d-flex justify-content-between align-items-center mt-2">` +
                        '<div class="flex-column">Cliente: ' + cart.name + ' ' + cart.lastNames + '<p><small>Direccion Envio: ' + cart.address + ', ' + cart.address2 + ', ' + cart.cp + ', Ensenada, B.C.' + '</small></p><span id="estado_pedido_' + cart._id + '" ' +
                        'class="mx-2 badge badge-warning badge-pill">' + getOrderState(cart) + '</span><span id="fecha_pedido_' + cart._id + '" class="mx-2 badge badge-warning badge-pill">Realizado: ' + cart.creationDate + '</span></div>';
                    let collapse_node = '<div class="collapse" id="collapsePedido' + cart._id + '"><div class="card card-body">' +
                        '<ul class="list-group list-group-horizontal">';
                    let total = 0;
                    $.ajax({
                        url: '/Orders/All/idCart/' + cart._id,
                        type: 'GET',
                        success: function (res, status) {
                            if (status !== 'nocontent') {
                                res.forEach(order => {
                                    $.ajax({
                                        url: '/Products/id/' + order.idProduct,
                                        type: 'GET',
                                        success: function (product, status) {
                                            if (status !== 'nocontent') {
                                                console.log(product);
                                                total += product.currentPrice * order.quantity;
                                                collapse_node += '<li class="list-group-item mx-2 shadow"><span>' + order.quantity.toString() + 'x</span> ' + product.name + '<span style="color: green;"><small> $' + order.unitaryPrice + '</small></span></li>';
                                                if (res.length === res.indexOf(order) + 1) {
                                                    if (!cart.completed) {
                                                        collapse_node += '</ul><div class="row my-3"><div id="col-btn-marcar" class="col-md-4"><button id="btnMarcar' + cart._id + '" onclick="markOrder(this)" class="btn btn-success btn-md btn-block" type="button">Marcar Como ' + getNextState(cart) + '</button>' +
                                                            '</div><div class="col-md-4"><button id="btnCancelar' + cart._id + '" onclick="cancelOrder(this)" class="btn btn-danger btn-md btn-block" type="button">Cancelar Pedido</button></div></div></div></div>';
                                                    } else {
                                                        collapse_node += '</ul><div class="row my-3"><div class="col-md-4"><button id="btnCancelar' + cart._id + '" onclick="cancelOrder(this)" class="btn btn-danger btn-md btn-block" type="button">Cancelar Pedido</button></div></div></div></div>';
                                                    }
                                                    node += '<div class="flex-column">Total: $' + total + '</div></div></a>';
                                                    $('#pedidos_list').append(node + collapse_node);
                                                }
                                            } else {
                                                openModal({ 'body_text': 'No se pudieron obtener los pedidos, intenta recargar la pagina.', 'operation': 'Failed' });
                                            }
                                        }
                                    }).fail(function (jqXHR, textStatus, errorThrown) {
                                        if (jqXHR.status === 0 || jqXHR.status == 500) {
                                            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                                        }
                                    });
                                });
                            } else {
                                openModal({ 'body_text': 'No se pudieron obtener los pedidos, intenta recargar la pagina.', 'operation': 'Failed' });
                            }
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status === 0 || jqXHR.status == 500) {
                            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
                        }
                    });
                });
                $('#spacer-div').attr('hidden', 'true');
                $('#content').removeAttr('hidden');
            } else {
                $('#spacer-div').removeAttr('hidden');
                $('#content').attr('hidden', 'true');
                openModal({ 'body_text': 'No se encontro ningun pedido.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

function getOrderState(state) {
    if (state.completed) {
        return 'COMPLETADO';
    } else {
        if (state.delivered) {
            return 'ENVIADO';
        } else {
            if (state.payed) {
                return 'PAGADO';
            } else {
                return 'COLOCADO';
            }
        }
    }
}

function getNextState(state) {
    if (state.sent && !state.payed)
        return 'PAGADO';
    if (state.payed && !state.delivered)
        return 'ENVIADO';
    if (state.delivered && !state.completed)
        return 'COMPLETADO';
}
function cancelOrder(event) {
    console.log(event.id);
    openModal({ 'body_text': 'Seguro que quieres cancelar este pedido? Se debera realizar una devolucion del pago.' });
    operation.operation = 'cancelar';
    operation.id = event.id.split('btnCancelar')[1];
}

function getCurrentOrderStateFromText(estado) {
    let state = { payed: false, delivered: false, completed: false, sent: false };
    switch (estado) {
        case 'PAGADO': state.payed = true; break;
        case 'ENVIADO': state.delivered = true; break;
        case 'COMPLETADO': state.completed = true; break;
        case 'COLOCADO': state.sent = true; break;
    }
    return state;
}

function markOrder(event) {
    operation.id = event.id.split('btnMarcar')[1];
    console.log(operation);
    console.log($('#estado_pedido_' + operation.id).text());
    openModal({ 'body_text': 'Seguro que quieres marcarlo como:' + getNextState(getCurrentOrderStateFromText($('#estado_pedido_' + operation.id).text())) });
    operation.operation = 'marcar_como';
}

function cleanOrders() {
    $.ajax({
        url: '/Carts/Admin/Clean',
        type: 'GET',
        success: function (data, status) {
            if (status !== 'nocontent') {
                openModal({ 'body_text': 'Se han eliminado todos los pedidos sin pagar.', 'operation': 'Success' });
            } else {
                openModal({ 'body_text': 'Ocurrio un problema al eliminar los pedidos, intentalo de nuevo.', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

/*

    ----FIN----FUNCIONES PARA EL MODULO DE ORDERS ADMIN.

*/


/*

    ----INICIO----FUNCIONES PARA EL MODULO DE ORDERS AUTH.

*/

function register() {
    var userInfo = {
        name: $('#inputName').val(), lastNames: $('#inputLastNames').val(), address: $('#inputAddress').val(), cp: $('#inputCP').val(),
        email: $('#inputEmail').val(), pass: $('#inputPassword').val(), telephone: $('#inputTelephone').val()
    };
    $.ajax({
        url: '/Auth/CreateUser',
        type: 'POST',
        data: userInfo,
        success(response, status) {
            if (status !== 'nocontent') {
                if (response.status === 'Error') {
                    openModal({ 'body_text': response.message, 'operation': 'Failed' });
                } else {
                    openModal({ 'body_text': response.message, 'operation': 'Success' });
                    $('#btn-close-modal').click(e => { parent.location = '/Login'; });
                }
            } else {
                openModal({ 'body_text': 'Ocurrio un error al crear el usuario', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}

function logIn() {
    var userInfo = { email: $('#inputEmail').val(), pass: $('#inputPassword').val() };
    $.ajax({
        url: '/Auth/LogIn',
        type: 'POST',
        data: userInfo,
        success(response, status) {
            if (status !== 'nocontent') {
                response.expire = new Date(Date.now() + (response.expire * 1000));
                localStorage.setItem('userSession', JSON.stringify(response));
                openModal({ 'body_text': 'Login Exitoso Bienvenido.', 'operation': 'Success' });
                $('#btn-close-modal').click(e => { parent.location = '/'; });
            } else {
                openModal({ 'body_text': 'Credenciales de usuario incorrectas', 'operation': 'Failed' });
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 0 || jqXHR.status == 500) {
            openModal({ 'body_text': 'Hubo un problema con el servidor, intenta de nuevo mas tarde.', 'operation': 'Failed' });
        }
    });
}