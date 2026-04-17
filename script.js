const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzyVP3pyA887MiiSuR0_kbMiv4Ce9PPyH8CsP0KP-x6XDxpZNuJ9kIRs9KNoSRgF3_Q/exec'; 

// ===== VARIABLES GLOBALES =====
let productos = [];
let servicios = [];
let categorias = [];
let catalogosIndex = [];

// ===== CARGAR DATOS DESDE APPS SCRIPT =====
async function cargarDatos() {
    mostrarLoader(true);
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();
        
        if (data.success) {
            productos = data.productos || [];
            servicios = data.servicios || [];
            categorias = data.categorias || [];
            catalogosIndex = data.catalogosIndex || [];
            renderizarTodo();
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
    mostrarLoader(false);
}

function mostrarLoader(mostrar) {
    let loader = document.getElementById('globalLoader');
    if (mostrar && !loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';
        loader.innerHTML = '<div style="background:#1e3c72;color:white;padding:20px 40px;border-radius:12px;">🔄 Cargando...</div>';
        document.body.appendChild(loader);
    } else if (!mostrar && loader) {
        loader.remove();
    }
}

function mostrarMensaje(texto, esError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${esError ? '#c62828' : '#4caf50'};color:white;padding:12px 24px;border-radius:8px;z-index:10001;animation:fadeOut 3s ease forwards;`;
    toast.innerHTML = esError ? '❌ ' + texto : '✅ ' + texto;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== RENDERIZAR TODO =====
function renderizarTodo() {
    // Renderizar filtros dinámicos (solo en catalogo.html)
    if (document.getElementById('catalogFilters')) {
        renderizarFiltros();
    }
    
    // Inicializar carrusel de servicios (solo en index.html)
    if (document.getElementById('servicesCarousel')) {
        renderizarServicios();
        renderizarCatalogoIndex();
    }
    
    // Inicializar catálogo dinámico (solo en catalogo.html)
    if (document.getElementById('catalogGrid')) {
        renderizarCatalogo();
    }
}

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
            <img class="card-img" src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="card-body">
                <h4>${producto.nombre}</h4>
                <p>${producto.descripcion}</p>
                <div class="catalog-features">
                    ${producto.caracteristicas ? producto.caracteristicas.split(',').map(c => `<span>${c.trim()}</span>`).join('') : ''}
                </div>
                <a href="contacto.html?producto=${encodeURIComponent(producto.nombre)}" class="btn-ver">Solicitar cotización</a>
            </div>
        </div>
    `).join('');
    
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

// ===== RENDERIZAR CATÁLOGO DEL INDEX =====
function renderizarCatalogoIndex() {
    const grid = document.getElementById('catalogGridIndex');
    if (!grid) return;
    
    grid.innerHTML = catalogosIndex.map(catalogo => `
        <div class="catalog-card" data-category="${catalogo.categoria}">
            <img src="${catalogo.imagen}" 
                 alt="${catalogo.titulo}" 
                 onerror="this.src='assets/images/placeholder.jpg'">
            <div class="catalog-card-body">
                <h4>${catalogo.titulo}</h4>
                <p>${catalogo.descripcion}</p>
                <a href="${catalogo.enlace}" class="btn-ver">Ver más</a>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('#catalogGridIndex .catalog-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.15}s`;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ===== RENDERIZAR FILTROS DINÁMICOS =====
function renderizarFiltros() {
    const filtersContainer = document.getElementById('catalogFilters');
    if (!filtersContainer) return;
    
    let buttonsHTML = `<button class="filter-btn active" data-filter="all">Todos</button>`;
    
    categorias.forEach(cat => {
        buttonsHTML += `<button class="filter-btn" data-filter="${cat.slug}">${cat.nombre}</button>`;
    });
    
    filtersContainer.innerHTML = buttonsHTML;
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarPorCategoria(filterValue);
        });
    });
}

// ===== CARRUSEL INFINITO DE SERVICIOS =====
let currentPosition = 0;
let autoScrollInterval = null;
let cardWidth = 0;
let gap = 24;

function renderizarServicios() {
    const track = document.getElementById('servicesCarousel');
    const dotsContainer = document.getElementById('servicesDots');
    if (!track) return;
    
    const serviciosTriplicados = [...servicios, ...servicios, ...servicios];
    
    track.innerHTML = serviciosTriplicados.map((servicio, idx) => `
        <div class="service-card" data-category="${servicio.categoria}" data-original-index="${idx % servicios.length}">
            <div class="card-header">
                <h3>${servicio.titulo}</h3>
            </div>
            <img class="card-img" 
                 src="${servicio.imagen}" 
                 alt="${servicio.titulo}" 
                 onerror="this.src='assets/images/placeholder.jpg'">
            <div class="card-body">
                <h4>${servicio.titulo}</h4>
                <p>${servicio.descripcion}</p>
                <a href="${servicio.enlace}" class="btn-ver">Ver más</a>
            </div>
        </div>
    `).join('');
    
    if (dotsContainer) {
        dotsContainer.innerHTML = servicios.map((_, idx) => `
            <div class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
        `).join('');
    }
    
    const firstCard = track.querySelector('.service-card');
    if (firstCard) {
        cardWidth = firstCard.offsetWidth;
    }
    
    const setWidth = servicios.length * (cardWidth + gap);
    track.scrollLeft = setWidth;
    currentPosition = setWidth;
    
    setupCarouselListeners();
    startAutoScroll();
}

function setupCarouselListeners() {
    const prevBtn = document.getElementById('prevService');
    const nextBtn = document.getElementById('nextService');
    const track = document.getElementById('servicesCarousel');
    const dots = document.querySelectorAll('.dot');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => scrollServices(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => scrollServices(1));
    }
    
    if (track) {
        track.addEventListener('scroll', () => {
            updateActiveDot();
            checkInfiniteScroll();
        });
        
        track.addEventListener('mouseenter', stopAutoScroll);
        track.addEventListener('mouseleave', startAutoScroll);
        
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                scrollServices(diff > 0 ? 1 : -1);
            }
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            scrollToService(index);
        });
    });
}

function scrollServices(direction) {
    const track = document.getElementById('servicesCarousel');
    if (!track) return;
    const scrollAmount = (cardWidth + gap) * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function scrollToService(index) {
    const track = document.getElementById('servicesCarousel');
    if (!track) return;
    const setWidth = servicios.length * (cardWidth + gap);
    const targetPosition = setWidth + (index * (cardWidth + gap));
    track.scrollTo({ left: targetPosition, behavior: 'smooth' });
}

function updateActiveDot() {
    const track = document.getElementById('servicesCarousel');
    if (!track) return;
    const setWidth = servicios.length * (cardWidth + gap);
    const relativeScroll = track.scrollLeft - setWidth;
    let activeIndex = Math.round(relativeScroll / (cardWidth + gap));
    activeIndex = ((activeIndex % servicios.length) + servicios.length) % servicios.length;
    
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        if (idx === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function checkInfiniteScroll() {
    const track = document.getElementById('servicesCarousel');
    if (!track) return;
    const totalWidth = track.scrollWidth;
    const setWidth = servicios.length * (cardWidth + gap);
    const scrollPos = track.scrollLeft;
    
    if (scrollPos >= totalWidth - setWidth - 100) {
        track.scrollLeft = setWidth;
    } else if (scrollPos <= 100) {
        track.scrollLeft = totalWidth - (setWidth * 2);
    }
}

function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
        const track = document.getElementById('servicesCarousel');
        if (track && !track.matches(':hover')) {
            scrollServices(1);
        }
    }, 5000);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// ===== SCROLL REVEAL ANIMATION =====
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

// ===== NAVBAR SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.13)' : '0 2px 16px rgba(0,0,0,0.08)';
    }
});

// ===== PREVENIR ENLACES VACÍOS =====
document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', (e) => e.preventDefault());
});

// ===== MARCAR ENLACE ACTIVO =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ===== BARRA DE PROGRESO =====
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

// ===== LOADER DE PÁGINA =====
const pageLoader = document.createElement('div');
pageLoader.style.position = 'fixed';
pageLoader.style.top = '0';
pageLoader.style.left = '0';
pageLoader.style.width = '100%';
pageLoader.style.height = '100%';
pageLoader.style.backgroundColor = '#fff';
pageLoader.style.display = 'flex';
pageLoader.style.alignItems = 'center';
pageLoader.style.justifyContent = 'center';
pageLoader.style.zIndex = '9999';
pageLoader.style.transition = 'opacity 0.5s';
pageLoader.innerHTML = '<div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #1565C0; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
document.body.appendChild(pageLoader);

window.addEventListener('load', () => {
    setTimeout(() => {
        pageLoader.style.opacity = '0';
        setTimeout(() => pageLoader.remove(), 500);
    }, 300);
});

// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById('contactFormPage');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const feedback = document.getElementById('formFeedbackPage');
        
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

// ===== MENÚ HAMBURGUESA =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999;display:none;';
    document.body.appendChild(overlay);
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        overlay.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    const closeMenu = () => {
        navLinks.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    overlay.addEventListener('click', closeMenu);
}

// ===== CERRAR MENÚ AL REDIMENSIONAR =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navLinks = document.getElementById('navLinks');
        const overlay = document.querySelector('.menu-overlay');
        if (navLinks) navLinks.classList.remove('active');
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
});