// Funciones compartidas para todas las páginas
(function() {
    
    // === FILTROS DE CATÁLOGO (solo en catalogo.html) ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');
    
    if (filterButtons.length > 0 && catalogItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                catalogItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
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
    
    // === FORMULARIO PÁGINA PRINCIPAL ===
    const mainForm = document.getElementById('contactForm');
    const mainFeedback = document.getElementById('formFeedback');
    
    if (mainForm && mainFeedback) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            
            if (!name || !email) {
                mainFeedback.innerHTML = '<span style="color:#c0392b;"><i class="fas fa-exclamation-circle"></i> Completa nombre y correo.</span>';
                return;
            }
            if (!email.includes('@')) {
                mainFeedback.innerHTML = '<span style="color:#c0392b;">Correo inválido.</span>';
                return;
            }
            
            mainFeedback.innerHTML = '<span style="color:#1e6f3f;"><i class="fas fa-check-circle"></i> ¡Mensaje enviado!</span>';
            mainForm.reset();
            setTimeout(() => mainFeedback.innerHTML = '', 4000);
        });
    }
    
    // === FORMULARIO PÁGINA CONTACTO ===
    const contactForm = document.getElementById('contactFormPage');
    const contactFeedback = document.getElementById('formFeedbackPage');
    
    if (contactForm && contactFeedback) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('fullName')?.value.trim();
            const email = document.getElementById('emailPage')?.value.trim();
            const message = document.getElementById('messagePage')?.value.trim();
            
            if (!name || !email || !message) {
                contactFeedback.innerHTML = '<span style="color:#c0392b;"><i class="fas fa-exclamation-circle"></i> Por favor completa todos los campos obligatorios.</span>';
                return;
            }
            if (!email.includes('@')) {
                contactFeedback.innerHTML = '<span style="color:#c0392b;">Ingresa un correo válido.</span>';
                return;
            }
            
            contactFeedback.innerHTML = '<span style="color:#1e6f3f;"><i class="fas fa-check-circle"></i> ¡Mensaje enviado! Te contactaremos en menos de 24 horas.</span>';
            contactForm.reset();
            setTimeout(() => contactFeedback.innerHTML = '', 5000);
        });
    }
    
    // === SCROLL SUAVE PARA ANCLAJES ===
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement && !this.getAttribute('href').includes('.html')) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                window.scrollBy(0, -navHeight + 15);
            }
        });
    });
    
    // === EFECTO DE CARGA PARA FILTROS ===
    if (catalogItems.length > 0) {
        catalogItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.3s';
        });
    }
    
})();