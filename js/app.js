// CONFIGURACIÓN DE API

// REEMPLAZA POR TU NUEVA API KEY
const API_KEY = "tu_api_key";


// CARRITO

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

actualizarContador();

function actualizarContador() {

    const contador =
        document.getElementById("contador");

    if (!contador) return;

    contador.textContent =
        carrito.length;
}

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarContador();
}

function agregarCarrito(nombre, precio) {

    carrito.push({
        nombre,
        precio
    });

    guardarCarrito();

    alert(nombre + " agregado al carrito");
}

function comprarAhora(nombre, precio) {

    const confirmar = confirm(
        `¿Comprar ${nombre} por ₲ ${precio.toLocaleString()}?`
    );

    if (confirmar) {

        alert(
            `Compra realizada\n\n${nombre}\n₲ ${precio.toLocaleString()}`
        );
    }
}

function vaciarCarrito() {

    if (confirm("¿Vaciar carrito?")) {

        carrito = [];

        localStorage.removeItem("carrito");

        mostrarCarrito();

        actualizarContador();
    }
}


// API RAWG
async function cargarJuegos() {

    const contenedor =
        document.getElementById("productos");

    if (!contenedor) return;

    try {

        const respuesta = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page_size=28`
        );

        const datos =
            await respuesta.json();

        contenedor.innerHTML = "";

        datos.results.forEach(juego => {

            const precio =
                Math.floor(
                    Math.random() * 350000
                ) + 100000;

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

async function cargarDestacados() {

    const contenedor =
        document.getElementById("destacados");

    if (!contenedor) return;

    try {

        const respuesta = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page_size=8`
        );

        const datos =
            await respuesta.json();

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

        contenedor.innerHTML =
            "<p>Error al cargar los destacados.</p>";

        console.error(error);
    }
}
cargarDestacados();

function mostrarCarrito() {

    const lista =
        document.getElementById("lista-carrito");

    const totalElemento =
        document.getElementById("total");

    if (!lista) return;

    carrito =
        JSON.parse(localStorage.getItem("carrito")) || [];

    lista.innerHTML = "";

    let total = 0;

    carrito.forEach(producto => {

        const li =
            document.createElement("li");

        li.textContent =
            producto.nombre +
            " - ₲ " +
            producto.precio.toLocaleString();

        lista.appendChild(li);

        total += producto.precio;
    });

    totalElemento.textContent =
        total.toLocaleString();
}
mostrarCarrito();


async function cargarDashboard() {

    const productosElemento =
        document.getElementById("total-productos");

    if (!productosElemento) return;

    try {

        const respuesta = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page_size=50`
        );

        const datos = await respuesta.json();

        // Productos

        productosElemento.textContent =
            datos.results.length;

        // Categorías

        const categorias = new Set();

        datos.results.forEach(juego => {

            juego.genres.forEach(genero => {

                categorias.add(genero.name);

            });

        });

        document.getElementById(
            "total-categorias"
        ).textContent = categorias.size;

        // Carrito

        const carrito =
            JSON.parse(
                localStorage.getItem("carrito")
            ) || [];

        document.getElementById(
            "productos-carrito"
        ).textContent = carrito.length;

        // Total

        let total = 0;

        carrito.forEach(producto => {

            total += producto.precio;

        });

        document.getElementById(
            "total-carrito"
        ).textContent =
            "₲ " + total.toLocaleString();

    } catch (error) {

        console.error(error);

    }
}

cargarDashboard();