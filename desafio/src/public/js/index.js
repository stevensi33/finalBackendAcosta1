const socket = io('http://localhost:9080');

document.getElementById('product-form').addEventListener('submit', getData);

function getData(e) {
    e.preventDefault();
    const title = document.getElementById('product-title').value;
    const description = document.getElementById('product-descr').value;
    const price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;
    const code = document.getElementById('product-pcode').value;
    const category = document.getElementById('product-category').value;
    const thumbElement = document.getElementById('product-file');
    const thumb = thumbElement.files.length > 0 ? thumbElement.files[0].name : '';

    const product = {
        title,
        description,
        code,
        price: Number(price),
        stock: Number(stock),
        category,
        thumb 
    };

    socket.emit('newProduct', product);
}

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('productList', productList => {
    renderProductList(productList);
});

function renderProductList(productList) {
    const productListTable = document.getElementById('productListTable').getElementsByTagName('tbody')[0];
    productListTable.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos productos
    productList.forEach(product => {
        productListTable.appendChild(createProductTableRow(product));
    });
}

function createProductTableRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.category}</td>
        <td>
            <button class="btn-delete" onclick="deleteProduct(${product.id})">Borrar</button>
        </td>
    `;
    return row;
}


// Y actualiza las referencias de 'createProductListItem' a 'createProductTableRow'
// en las funciones 'renderProductList' y los eventos de Socket.IO.


function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}

// Escuchar eventos de nuevos productos agregados
socket.on('newProduct', product => {
    const productListContainer = document.getElementById('productListUL');
    productListContainer.appendChild(createProductTableRow(product));
});

// Escuchar eventos de producto eliminado
socket.on('deleteProduct', productId => {
    const element = document.querySelector(`li[data-id="${productId}"]`);
    if (element) {
        element.parentNode.removeChild(element);
    }
});
