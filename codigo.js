document.addEventListener("DOMContentLoaded", () => {
    // SLIDER AUTOMÁTICO
    const productos = document.querySelectorAll('.producto');
    let indice = 0;
    if (productos.length > 0) {
        setInterval(() => {
            productos[indice].classList.remove('active');
            indice = (indice + 1) % productos.length;
            productos[indice].classList.add('active');
        }, 4000);
    }

    const carritoBtn = document.querySelector(".btn-carrito");
    const popup = document.getElementById("carrito-popup");
    const cerrarBtn = document.getElementById("cerrar-carrito");
    const catalogoBtn = document.getElementById("catalogoBtn");
    const catalogoMenu = document.getElementById("catalogoMenu");

    carritoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        popup.classList.toggle("visible");
        cargarCarrito();
    });

    cerrarBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
    });

    catalogoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        catalogoMenu.style.display = catalogoMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener("click", (e) => {
        // Cerrar catálogo si se clickea fuera
        if (!catalogoMenu.contains(e.target) && e.target !== catalogoBtn) {
            catalogoMenu.style.display = 'none';
        }
        // Cerrar carrito si se clickea fuera
        if (
            popup.classList.contains("visible") &&
            !popup.contains(e.target) &&
            !carritoBtn.contains(e.target)
        ) {
            popup.classList.remove("visible");
        }
    });

    actualizarContadorCarrito();

    document.getElementById('btn-comprar').addEventListener('click', () => {
        window.location.href = 'compras/pago.html';
    });
});

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(p => p.nombre === nombre);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const tbody = document.querySelector("#tabla-carrito tbody");
    const totalDiv = document.getElementById("total-carrito");
    tbody.innerHTML = "";

    let totalGeneral = 0;

    carrito.forEach((producto, index) => {
        const totalProducto = producto.precio * producto.cantidad;
        totalGeneral += totalProducto;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>$${totalProducto}</td>
            <td><button class="eliminar">X</button></td>
        `;
        tbody.appendChild(fila);


        fila.querySelector(".eliminar").addEventListener("click", e => {
            e.stopPropagation();
            eliminarProducto(index);
        });
    });

    totalDiv.textContent = `Total: $${totalGeneral.toLocaleString()}`;
}

function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    document.getElementById("carrito-contador").textContent = total;
}
