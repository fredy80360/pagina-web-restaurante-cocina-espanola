// --- 1. SELECCIÓN DE ELEMENTOS ---
const carrito = document.querySelector('#carrito');
const carritoIcono = document.querySelector('#img-carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaPlatillos = document.querySelector('#lista-1');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const loadMoreBtn = document.querySelector('#load-more');

// Variables de estado
let articulosCarrito = [];
let currentItem = 4; // Empezamos mostrando los primeros 4

// --- 2. EVENT LISTENERS ---
cargarEventListeners();

function cargarEventListeners() {
   // Al hacer clic en "Agregar al carrito"
   listaPlatillos.addEventListener('click', agregarPlatillo);

   // Al eliminar un producto del carrito
   carrito.addEventListener('click', eliminarPlatillo);

   // Al cargar el documento (LocalStorage)
   document.addEventListener('DOMContentLoaded', () => {
      articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carritoHTML();
   });

   // Botón vaciar carrito
   vaciarCarritoBtn.addEventListener('click', () => {
      articulosCarrito = [];
      limpiarHTML();
      localStorage.removeItem('carrito');
   });

   // BOTÓN CARGAR MÁS (Corregido para 4 productos)
   loadMoreBtn.addEventListener('click', (e) => {
      // Buscamos las cajas específicamente dentro de la sección de productos
      let boxes = [...document.querySelectorAll('.products .box')];

      for (let i = currentItem; i < currentItem + 4; i++) {
         if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
         }
      }

      currentItem += 4;

      // Ocultar botón si ya no hay más que mostrar
      if (currentItem >= boxes.length) {
         loadMoreBtn.style.display = 'none';
      }
   });
}

// --- 3. FUNCIONES ---

function agregarPlatillo(e) {
   e.preventDefault();
   if (e.target.classList.contains('agregar-carrito')) {
      const platilloSeleccionado = e.target.parentElement.parentElement;
      leerDatosPlatillo(platilloSeleccionado);

      // Animación del carrito
      carritoIcono.classList.add('animar-carrito');
      setTimeout(() => {
         carritoIcono.classList.remove('animar-carrito');
      }, 500);
   }
}

function eliminarPlatillo(e) {
   if (e.target.classList.contains('borrar-platillo')) {
      const platilloId = e.target.getAttribute('data-id');
      articulosCarrito = articulosCarrito.filter(p => p.id !== platilloId);
      carritoHTML();
   }
}

function leerDatosPlatillo(platillo) {
   const infoPlatillo = {
      imagen: platillo.querySelector('img').src,
      titulo: platillo.querySelector('h3').textContent,
      precio: platillo.querySelector('.precio').textContent,
      id: platillo.querySelector('a').getAttribute('data-id'),
      cantidad: 1
   }

   const existe = articulosCarrito.some(p => p.id === infoPlatillo.id);
   if (existe) {
      articulosCarrito = articulosCarrito.map(p => {
         if (p.id === infoPlatillo.id) {
            p.cantidad++;
            return p;
         } else {
            return p;
         }
      });
   } else {
      articulosCarrito = [...articulosCarrito, infoPlatillo];
   }
   carritoHTML();
}

function carritoHTML() {
   limpiarHTML();
   articulosCarrito.forEach(p => {
      const { imagen, titulo, precio, cantidad, id } = p;
      const row = document.createElement('tr');
      row.innerHTML = `
            <td><img src="${imagen}" width="50"></td>
            <td style="color: #000;">${titulo}</td>
            <td style="color: #000;">${precio}</td>
            <td style="color: #000;">${cantidad}</td>
            <td>
                <a href="#" class="borrar-platillo" data-id="${id}" style="color:red; font-weight:bold;"> X </a>
            </td>
        `;
      contenedorCarrito.appendChild(row);
   });
   localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
   while (contenedorCarrito.firstChild) {
      contenedorCarrito.removeChild(contenedorCarrito.firstChild);
   }
}


// --- EFECTO DE BARRA DE NAVEGACIÓN DINÁMICA ---
window.onscroll = () => {
   const nav = document.querySelector('.menu');
   // Si el scroll baja más de 50px, añade la clase active, si no, la quita
   if (window.scrollY > 50) {
      nav.classList.add('active');
   } else {
      nav.classList.remove('active');
   }
};