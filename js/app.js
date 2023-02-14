// Variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

console.log(`carrito ${carrito}`);
console.log(`contenedorCarrito ${contenedorCarrito}`);
console.log(`vaciarCarritoBtn ${vaciarCarritoBtn}`);
console.log(`listaCursos ${listaCursos}`);


cargarEventListeners();
// Registro todos mi EventListeners
function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Muestraa los cursos del Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Reseteamos el arreglo
        articulosCarrito = [];

        // Eliminamos todo el HTML
        limpiar();
    })
}

// Funciones

function agregarCurso(e) {
    e.preventDefault();

    // Verificamos si el elemento que estamos dando click contiene la clase agregar-carrito
    if ( e.target.classList.contains('agregar-carrito') ) {

        // Guardamos el HTML de toda la tarjeta contenedora al boton al cual le dimos click
        const cursoSeleccionado = e.target.parentElement.parentElement;
        // Pasamos ese HTML a la funcion
        leerDatosCurso( cursoSeleccionado );
    }
}

// Eliminar un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        // Accedemos al id del curso que vamos a eliminar
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );

        carritoHTML(); //Iterar sobre el carrito y mostrar su HTML
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso) {
    // console.log(curso);

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Antes de agregar los elementos al Carrito Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if( curso.id === infoCurso.id ) {
                curso.cantidad++;
                return curso; //retorna el objeto actualizado
            } else {
                return curso; //retorna los objetos que no son los duplicados
            }
        } )
        articulosCarrito = [...cursos]
    } else {
        // Agrega elementos al arreglo articulosCarrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    // console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el Carrito de compras (Array articulosCarrito) en el HTML
function carritoHTML() {

    // Limpiar el HTML
    limpiar();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>

            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // Agregar el HTML del carrito en el body
        contenedorCarrito.appendChild(row);
    });

    // Agregar el carrito de compras al Storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}


// Eliminar los cursos del tbody para limpiar el HTML

function limpiar() {
    // Forma Lenta
    // contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}