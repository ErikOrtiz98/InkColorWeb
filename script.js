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

// Filtros del catálogo
if (document.querySelector('.catalog-filters')) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item-full');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            catalogItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 200);
                }
            });
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