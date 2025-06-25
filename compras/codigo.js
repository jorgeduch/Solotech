document.addEventListener("DOMContentLoaded", function () {
    const despachoRadio = document.getElementById("envio_despacho");
    const retiroRadio = document.getElementById("envio_retiro");
    const direccionDespacho = document.getElementById("direccion_despacho");

    function toggleDireccion() {
        if (despachoRadio.checked) {
            direccionDespacho.style.display = "block";
        } else {
            direccionDespacho.style.display = "none";
        }
    }

    despachoRadio.addEventListener("change", toggleDireccion);
    retiroRadio.addEventListener("change", toggleDireccion);


    toggleDireccion();
});



function cargarMapa() {
    const direccion = document.getElementById("direccion").value;
    const comuna = document.getElementById("comuna").value;
    const region = document.getElementById("region").value;

    const direccionCompleta = encodeURIComponent(`${direccion}, ${comuna}, ${region}, Chile`);
    const url = `https://www.google.com/maps?q=${direccionCompleta}&output=embed`;

    document.getElementById("iframe_mapa").src = url;
}


const chile = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Casablanca", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Algarrobo", "Quillota", "La Calera", "La Cruz", "Limache", "Olmué", "Petorca", "La Ligua", "Papudo", "Zapallar", "San Felipe", "Los Andes", "Putaendo", "Santa María", "Panquehue"],
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "La Pintana", "San Bernardo", "Ñuñoa", "Pudahuel", "Lo Prado", "Cerro Navia", "Recoleta", "Renca", "Conchalí", "Peñalolén", "Macul", "San Miguel", "El Bosque", "La Granja", "Independencia", "Estación Central", "Huechuraba", "Pedro Aguirre Cerda", "Quilicura", "San Joaquín", "Vitacura", "Providencia"],
    "O'Higgins": ["Rancagua", "Machalí", "San Fernando", "Santa Cruz", "Graneros", "Rengo", "Requínoa", "Chimbarongo"],
    "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Parral", "Cauquenes"],
    "Ñuble": ["Chillán", "San Carlos", "Quillón", "Bulnes", "Yungay"],
    "Biobío": ["Concepción", "Coronel", "Talcahuano", "San Pedro de la Paz", "Hualpén", "Los Ángeles", "Chiguayante"],
    "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Nueva Imperial"],
    "Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"],
    "Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón"],
    "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
    "Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir"],
};

const regionSelect = document.getElementById('region');
const comunaSelect = document.getElementById('comuna');

const choicesRegion = new Choices(regionSelect, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
    placeholderValue: 'Seleccione una región',
});

const choicesComuna = new Choices(comunaSelect, {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: false,
    placeholderValue: 'Seleccione una comuna',
    removeItemButton: true,
});

// Agregar opción placeholder para región
choicesRegion.setChoices([{ value: '', label: 'Seleccione una región', disabled: true, selected: true }], 'value', 'label', false);

// Agregar regiones sin borrar placeholder
const regionesArray = Object.keys(chile).map(r => ({ value: r, label: r }));
choicesRegion.setChoices(regionesArray, 'value', 'label', true);

// Agregar opción placeholder para comuna
choicesComuna.setChoices([{ value: '', label: 'Seleccione una comuna', disabled: true, selected: true }], 'value', 'label', false);
comunaSelect.disabled = true;

regionSelect.addEventListener('change', () => {
    const comunas = chile[regionSelect.value] || [];

    // Limpia comunas actuales
    choicesComuna.clearStore();

    if (comunas.length === 0) {
        comunaSelect.disabled = true;
        choicesComuna.setChoices([{ value: '', label: 'No hay comunas disponibles', disabled: true, selected: true }], 'value', 'label', false);
    } else {
        comunaSelect.disabled = false;
        const comunaOptions = comunas.map(c => ({ value: c, label: c }));
        choicesComuna.setChoices(comunaOptions, 'value', 'label', true);
    }
});



// Cargar carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {

    function cargarCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const listaProductos = document.getElementById("lista-productos");
        const totalCarrito = document.getElementById("total-carrito");
        if (!listaProductos || !totalCarrito) return;

        listaProductos.innerHTML = "";

        if (carrito.length === 0) {
            listaProductos.innerHTML = "<p>No hay productos en el carrito.</p>";
            totalCarrito.textContent = "";
            return;
        }

        let total = 0;

        carrito.forEach((producto, index) => {
            const productoDiv = document.createElement("div");
            productoDiv.style.borderBottom = "1px solid #ccc";
            productoDiv.style.padding = "10px 0";

            productoDiv.innerHTML = `
                <p><strong>${producto.nombre}</strong></p>
                <label style="display: flex; align-items: center; gap: 8px;">
                    Cantidad:
                    <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" class="input-cantidad" style="width: 50px;">
                    <button class="btn-eliminar" data-index="${index}" style="
                        background:rgb(210, 74, 64);
                        border: none;
                        width: 50px;
                        margin-left: 30px;
                        height: 30px;
                        color: black;
                        font-size: 25px;
                        cursor: pointer;
                        padding: 0 6px;
                        line-height: 1;
                    ">x</button>
                </label>
                <p>Precio unitario: $${producto.precio.toLocaleString()}</p>
                <p>Subtotal: $${(producto.precio * producto.cantidad).toLocaleString()}</p>
            `;

            listaProductos.appendChild(productoDiv);

            total += producto.precio * producto.cantidad;
        });

        totalCarrito.textContent = `Total a pagar: $${total.toLocaleString()}`;

        // Eventos para inputs de cantidad
        document.querySelectorAll(".input-cantidad").forEach(input => {
            input.addEventListener("change", (e) => {
                const idx = e.target.dataset.index;
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                actualizarCantidad(idx, val);
            });
        });

        // Eventos para botones eliminar
        // para eliminar productos del carrito
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.dataset.index;
                eliminarProducto(idx);
            });
        });
    }

    // Actualiza la cantidad de un producto en el carrito
    function actualizarCantidad(index, cantidad) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito[index].cantidad = cantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
    }

    // Elimina producto del carrito
    // y recarga lista
    function eliminarProducto(index) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
    }

    // Llenar inputs del carrito para el formulario de pago
    function llenarInputsCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const inputsCarrito = document.getElementById('inputs-carrito');
        if (!inputsCarrito) return;

        inputsCarrito.innerHTML = '';

        carrito.forEach((producto, index) => {
            const inputNombre = document.createElement('input');
            inputNombre.type = 'hidden';
            inputNombre.name = `producto_nombre_${index}`;
            inputNombre.value = producto.nombre;
            inputsCarrito.appendChild(inputNombre);

            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'hidden';
            inputCantidad.name = `producto_cantidad_${index}`;
            inputCantidad.value = producto.cantidad;
            inputsCarrito.appendChild(inputCantidad);

            const inputPrecio = document.createElement('input');
            inputPrecio.type = 'hidden';
            inputPrecio.name = `producto_precio_${index}`;
            inputPrecio.value = producto.precio;
            inputsCarrito.appendChild(inputPrecio);
        });
    }


    cargarCarrito();
    llenarInputsCarrito();

    // Manejo del formulario de pago
    const form = document.getElementById('formulario-pago');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            llenarInputsCarrito();

            const datosFormulario = new FormData(form);
            let contenido = 'Resumen de la compra\n\nDatos del comprador:\n';

            ['nombre', 'apellidos', 'rut', 'correo', 'telefono'].forEach(campo => {
                contenido += `${campo.charAt(0).toUpperCase() + campo.slice(1)}: ${datosFormulario.get(campo) || ''}\n`;
            });

            contenido += '\nProductos comprados:\n';

            let i = 0;
            while (datosFormulario.get(`producto_nombre_${i}`)) {
                const nombre = datosFormulario.get(`producto_nombre_${i}`);
                const cantidad = datosFormulario.get(`producto_cantidad_${i}`);
                const precio = datosFormulario.get(`producto_precio_${i}`);
                const subtotal = cantidad * precio;
                contenido += `- ${nombre} | Cantidad: ${cantidad} | Precio unitario: $${precio} | Subtotal: $${subtotal}\n`;
                i++;
            }

            let total = 0;
            for (let j = 0; j < i; j++) {
                total += parseFloat(datosFormulario.get(`producto_cantidad_${j}`)) * parseFloat(datosFormulario.get(`producto_precio_${j}`));
            }
            contenido += `\nTotal a pagar: $${total.toLocaleString()}\n`;

            contenido += `\nTipo de envío: ${datosFormulario.get('envio') || ''}\n`;
            contenido += `Tipo de pago: ${datosFormulario.get('pago') || ''}\n`;


            const blob = new Blob([contenido], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'resumen_compra.txt';
            a.click();

            URL.revokeObjectURL(url);
        });
    }
});
