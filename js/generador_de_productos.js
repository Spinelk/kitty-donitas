let Inventario = [];

async function consultar_inventario() {
    try {
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vQiH0FZYBbMc1CNhcZZ0qO-pb9jmh13D0PZ8otf9f_1Aypzn7lThduqhdG_gF1LSdvyxfCudGXUujkY/pub?output=csv"
        );
        const csv = await response.text();
        const rows = csv.split("\n").map((row) => row.split(","));
        const headers = rows[0]; // Cabeceras: producto, categoria, stock, precio, url imagen
        Inventario = rows.slice(1).map((row) => {
            return {
                producto: row[0],
                categoria: row[1],
                stock: row[2],
                precio: row[3],
                img: row[4],
            };
        });
        console.table(Inventario); // Verificar datos
    } catch (error) {
        console.error("Error al obtener el CSV:", error);
    }
}

async function spawn_cartas() {
    if (Inventario.length === 0) {
        console.error(
            "Inventario vacío. Asegúrate de cargar los datos primero."
        );
        return;
    }

    for (let i = 0; i < Inventario.length; i++) {
        crear_carta(Inventario[i]);
    }
}

function crear_carta(Producto) {
    const { producto, precio, img, categoria, stock } = Producto;

    const carta = document.createElement("div");
    carta.className = "card text-bg-light rounded-4 shadow-lg border-0";
    carta.innerHTML = `
        <div class="card-body px-4 pt-4 pb-1">
            <div class="px-2 pb-4">
                <div class="d-flex gap-3 pb-2">
                    <div class="my-auto ">
                        <h5 class="card-title fw-bold fs-5 text-capitalize" style="user-select: none;">
                            ${producto}
                        </h5>
                        <h5 class="card-title fw-bold fs-6 text-capitalize" style="user-select: none;">
                            ${precio}$
                        </h5>
                    </div>
                </div>
            </div>
            <div>
                <div class="ratio ratio-1x1">
                    <img src="${img}" class="card-img-bottom rounded-4 shadow-lg" alt="${producto}">
                </div>
            </div>
            <div class="px-2 py-1">
                <span class="card-title fw-lighter fs-6 text-capitalize" style="user-select: none;">
                    ${categoria} | ${stock}
                </span>
            </div>
        </div>
    `;

    const postsContainer = document.getElementById("posts");
    if (postsContainer) {
        postsContainer.appendChild(carta);
    } else {
        console.error("El contenedor con id 'posts' no existe en el DOM.");
    }
}

(async function init() {
    await consultar_inventario(); // Espera a que se cargue el inventario
    spawn_cartas(); // Luego genera las cartas
})();
