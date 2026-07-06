// CONFIGURACIÓN DE API

// REEMPLAZA POR TU NUEVA API KEY
const API_KEY = "tu api key";


// CARRITO

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];//busca los elementos en carrito


// Actualiza el contador del carrito
function actualizarContador() {

    const contador = document.getElementById("contador");//asigna contador a una variable

    if (!contador) return;

    contador.textContent = carrito.length;//cuenta cuantos elementos hay en el carrito
}

actualizarContador();


// Guarda el carrito en localStorage
function guardarCarrito() {

    localStorage.setItem("carrito", JSON.stringify(carrito));//guarda los productos

    actualizarContador();
}


// Agrega un producto al carrito
function agregarCarrito(nombre, precio) {//guarda al carrito

    carrito.push({
        nombre,
        precio
    });

    guardarCarrito();

    alert(nombre + " agregado al carrito");
}


// Simula la compra de un producto
function comprarAhora(nombre, precio) {

    const confirmar = confirm(`¿Comprar ${nombre} por ₲ ${precio.toLocaleString()}?`);

    if (confirmar) {

        alert(`Compra realizada\n\n${nombre}\n₲ ${precio.toLocaleString()}`);
    }
}


// Vacía completamente el carrito
function vaciarCarrito() {

    if (confirm("¿Vaciar carrito?")) {

        carrito = [];

        localStorage.removeItem("carrito");

        mostrarCarrito();

        actualizarContador();
    }
}


// API RAWG

// Carga los videojuegos desde la API
async function cargarJuegos() {

    const contenedor = document.getElementById("productos");

    if (!contenedor) return;

    try {

        const respuesta = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=28`);//consulta a la api

        const datos = await respuesta.json();

        contenedor.innerHTML = "";

        datos.results.forEach(juego => {//.results es el contenedor de lo solicitado a la api

            const precio = Math.floor(Math.random() * 350000) + 100000;

            //inner permite insertar html a la clase card
            contenedor.innerHTML += `
                <div class="card">

                    <img
                        src="${juego.background_image}"
                        alt="${juego.name}"
                    >

                    <h3>${juego.name}</h3>

                    <p>
                        ⭐ ${juego.rating}
                    </p>

                    <p>
                        ₲ ${precio.toLocaleString()}
                    </p>

                    <button
                        onclick="agregarCarrito('${juego.name.replace(/'/g, "\\'")}', ${precio})"
                    >
                        Agregar al carrito
                    </button>

                    <button
                        onclick="comprarAhora('${juego.name.replace(/'/g, "\\'")}', ${precio})"
                    >
                        Comprar ahora
                    </button>

                </div>
            `;
        });

    } catch (error) {

        contenedor.innerHTML =
            "<h2>Error al cargar los juegos.</h2>";

        console.error(error);
    }
}

cargarJuegos();


// Carga los juegos destacados del inicio
async function cargarDestacados() {

    const contenedor = document.getElementById("destacados");

    if (!contenedor) return;

    try {

        const respuesta = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=8`);

        const datos = await respuesta.json();

        contenedor.innerHTML = "";

        datos.results.forEach(juego => {

            contenedor.innerHTML += `
                <div class="card">

                    <img
                        src="${juego.background_image}"
                        alt="${juego.name}"
                    >

                    <h3>${juego.name}</h3>

                    <p>
                        ⭐ ${juego.rating}
                    </p>

                </div>
            `;
        });

    } catch (error) {

        contenedor.innerHTML = "<p>Error al cargar los destacados.</p>";

        console.error(error);
    }
}

cargarDestacados();


// Muestra los productos del carrito
function mostrarCarrito() {

    const lista = document.getElementById("lista-carrito");

    const totalElemento = document.getElementById("total");

    if (!lista) return;

    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    lista.innerHTML = "";

    let total = 0;

    carrito.forEach(producto => {

        const li = document.createElement("li");

        li.textContent = producto.nombre + " - ₲ " + producto.precio.toLocaleString();

        lista.appendChild(li);

        total += producto.precio;
    });

    totalElemento.textContent = total.toLocaleString();
}

mostrarCarrito();


// Carga las estadísticas del dashboard
async function cargarDashboard() {

    const productosElemento = document.getElementById("total-productos");

    if (!productosElemento) return;

    try {

        const respuesta = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=28`);

        const datos = await respuesta.json();

        productosElemento.textContent = datos.results.length;

        const categorias = new Set();

        datos.results.forEach(juego => {

            juego.genres.forEach(genero => {

                categorias.add(genero.name);

            });

        });

        document.getElementById("total-categorias").textContent = categorias.size;

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        document.getElementById("productos-carrito").textContent = carrito.length;

        let total = 0;

        carrito.forEach(producto => {

            total += producto.precio;

        });

        document.getElementById("total-carrito").textContent = "₲ " + total.toLocaleString();

    } catch (error) {

        console.error(error);

    }
}

cargarDashboard();