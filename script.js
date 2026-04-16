// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.service-card, .catalog-card, .catalog-item-full, .contact-method, .contact-form-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.13)' : '0 2px 16px rgba(0,0,0,0.08)';
    }
});

// Prevenir comportamiento por defecto de enlaces vacíos
document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', (e) => e.preventDefault());
});

// Marcar enlace activo en el menú
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Barra de progreso de scroll
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.width = '0%';
progressBar.style.height = '3px';
progressBar.style.background = 'linear-gradient(90deg, #1565C0, #C62828, #fdd835, #43a047)';
progressBar.style.zIndex = '10000';
progressBar.style.transition = 'width 0.1s';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// Loader de página
const loader = document.createElement('div');
loader.style.position = 'fixed';
loader.style.top = '0';
loader.style.left = '0';
loader.style.width = '100%';
loader.style.height = '100%';
loader.style.backgroundColor = '#fff';
loader.style.display = 'flex';
loader.style.alignItems = 'center';
loader.style.justifyContent = 'center';
loader.style.zIndex = '9999';
loader.style.transition = 'opacity 0.5s';
loader.innerHTML = '<div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #1565C0; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
document.body.appendChild(loader);

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 300);
});

// ===== FILTROS DEL CATÁLOGO (CORREGIDO) =====
if (document.querySelector('.catalog-filters')) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item-full');
    const catalogGrid = document.querySelector('.full-catalog-grid');

    function filterCatalog(filterValue) {
        let visibleCount = 0;
        
        catalogItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'flex';
                item.style.opacity = '1';
                item.style.order = visibleCount; // Mantiene el orden
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
        
        // Si no hay elementos visibles, muestra un mensaje
        if (visibleCount === 0) {
            let noResultsMsg = document.querySelector('.no-results');
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px;">No hay productos en esta categoría.</p>';
                catalogGrid.appendChild(noResultsMsg);
            }
        } else {
            const noResultsMsg = document.querySelector('.no-results');
            if (noResultsMsg) noResultsMsg.remove();
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar
            filterCatalog(filterValue);
        });
    });
}

// Formulario de contacto
// Formulario de contacto con Formspree
const contactForm = document.getElementById('contactFormPage');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const feedback = document.getElementById('formFeedbackPage');
        
        // Mostrar loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                feedback.innerHTML = '<span style="color:#1565C0;">✅ ¡Mensaje enviado! Te contactaremos pronto.</span>';
                contactForm.reset();
                setTimeout(() => feedback.innerHTML = '', 5000);
            } else {
                feedback.innerHTML = '<span style="color:#C62828;">❌ Error al enviar. Intenta de nuevo.</span>';
            }
        } catch (error) {
            feedback.innerHTML = '<span style="color:#C62828;">❌ Error de conexión. Verifica tu internet.</span>';
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        setTimeout(() => feedback.innerHTML = '', 5000);
    });
}

// ===== CATÁLOGO DE PRODUCTOS (DINÁMICO) =====
const productos = [
    {
        id: 1,
        nombre: "Pizarrón Magnético Corporativo",
        categoria: "pizarrones",
        descripcion: "Ideal para oficinas y salas de juntas. Personalizable con tu logo.",
        caracteristicas: ["✔️ Tamaños a medida", "✔️ Blanco o verde", "✔️ Marco de aluminio"],
        imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 2,
        nombre: "Pizarrón Académico",
        categoria: "pizarrones",
        descripcion: "Perfecto para escuelas y centros de capacitación. Superficie de alta durabilidad.",
        caracteristicas: ["✔️ Incluye bandeja", "✔️ Fácil limpieza", "✔️ Instalación sencilla"],
        imagen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 3,
        nombre: "Señales de Seguridad NOM",
        categoria: "senaletica",
        descripcion: "Señalamientos normados de prevención, obligación y emergencia.",
        caracteristicas: ["✔️ Material reflectivo", "✔️ Tamaños personalizados", "✔️ Normas NOM"],
        imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 4,
        nombre: "Señalética Direccional",
        categoria: "senaletica",
        descripcion: "Letreros y placas para orientación en centros comerciales y hospitales.",
        caracteristicas: ["✔️ Diseño personalizado", "✔️ Bilingüe disponible", "✔️ Alta visibilidad"],
        imagen: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 5,
        nombre: "Etiquetas Adhesivas Full Color",
        categoria: "etiquetas",
        descripcion: "Etiquetas personalizadas para productos y empaques. Alta calidad de impresión.",
        caracteristicas: ["✔️ Resistentes al agua", "✔️ Troquelado personalizado", "✔️ Acabado mate/brillante"],
        imagen: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 6,
        nombre: "Etiquetas con Código QR",
        categoria: "etiquetas",
        descripcion: "Etiquetas con código QR o barras para inventario y logística.",
        caracteristicas: ["✔️ QR personalizado", "✔️ Numeración variable", "✔️ Alta durabilidad"],
        imagen: "https://images.unsplash.com/photo-1585247226801-bc613c441316?w=400&q=80",
        precio: "Cotizar"
    },
    {
        id: 7,
        nombre: "Stand Promocional para Ferias",
        categoria: "stands",
        descripcion: "Estructuras para exposiciones y eventos. Fáciles de armar y transportar.",
        caracteristicas: ["✔️ Armado rápido", "✔️ Incluye maleta", "✔️ Impresión full color"],
        imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
        precio: "Cotizar"
    }
];

// ===== FUNCIÓN PARA RENDERIZAR PRODUCTOS =====
function renderizarCatalogo(productosFiltrados = null) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    const productosAMostrar = productosFiltrados || productos;
    
    if (productosAMostrar.length === 0) {
        grid.innerHTML = '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><h3>No hay productos en esta categoría</h3><p>Pronto agregaremos más opciones para ti.</p></div>';
        return;
    }
    
    grid.innerHTML = productosAMostrar.map(producto => `
        <div class="catalog-item-full" data-category="${producto.categoria}" data-id="${producto.id}">
            <div class="card-header">
                <h3>${producto.nombre.split(' ')[0]} ${producto.nombre.split(' ')[1] || ''}</h3>
            </div>
            <img class="card-img" src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/400x180/333/fff?text=${encodeURIComponent(producto.nombre)}'">
            <div class="card-body">
                <h4>${producto.nombre}</h4>
                <p>${producto.descripcion}</p>
                <div class="catalog-features">
                    ${producto.caracteristicas.map(car => `<span>${car}</span>`).join('')}
                </div>
                <a href="contacto.html?producto=${encodeURIComponent(producto.nombre)}" class="btn-ver">Solicitar cotización</a>
            </div>
        </div>
    `).join('');
    
    // Re-aplicar animación de entrada
    document.querySelectorAll('.catalog-item-full').forEach((item, index) => {
        item.style.animation = `fadeInScale 0.3s ease ${index * 0.05}s forwards`;
        item.style.opacity = '0';
    });
}

// ===== FUNCIÓN PARA FILTRAR =====
function filtrarPorCategoria(categoria) {
    if (categoria === 'all') {
        renderizarCatalogo(productos);
    } else {
        const filtrados = productos.filter(p => p.categoria === categoria);
        renderizarCatalogo(filtrados);
    }
}

// ===== INICIALIZAR FILTROS =====
if (document.querySelector('.catalog-filters')) {
    // Renderizar productos al cargar
    renderizarCatalogo();
    
    // Configurar botones de filtro
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar
            filtrarPorCategoria(filterValue);
        });
    });
}