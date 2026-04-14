// ============================================
// SCRIPT-ANIMATIONS.JS - Animaciones avanzadas
// ============================================

(function() {
    
    // === BARRA DE PROGRESO DE SCROLL ===
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // === NAVBAR TRANSPARENTE AL SCROLL ===
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // === REVELAR ELEMENTOS AL HACER SCROLL ===
    const revealElements = document.querySelectorAll('.service-card, .catalog-item, .mini-card, .contact-method, .contact-form-card');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('scroll-reveal', 'revealed');
            }
        });
    };
    
    // Aplicar clase scroll-reveal a los elementos
    revealElements.forEach(element => {
        element.classList.add('scroll-reveal');
    });
    
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    
    // === ANIMACIÓN ESCALONADA PARA EL GRID DE SERVICIOS ===
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animation = `slideUp 0.5s ease forwards`;
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // === ANIMACIÓN ESCALONADA PARA EL CATÁLOGO ===
    const catalogItems = document.querySelectorAll('.catalog-item');
    catalogItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.08}s`;
    });
    
    // === EFECTO DE CARGA DE PÁGINA ===
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
    
    // === ANIMACIÓN DE INPUTS ===
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('input-focused');
            }
        });
    });
    
    // === EFECTO RIPPLE EN BOTONES ===
    const buttons = document.querySelectorAll('.btn-primary, .btn-catalog, .btn-send, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.position = 'absolute';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // === EFECTO DE TEXTO CON MÁQUINA DE ESCRIBIR ===
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && heroTitle.innerText === 'Todo lo que imagines en impresión') {
        const originalText = heroTitle.innerText;
        heroTitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.classList.add('typing-effect');
            heroTitle.style.whiteSpace = 'nowrap';
            heroTitle.style.overflow = 'hidden';
            heroTitle.style.opacity = '1';
            
            let i = 0;
            heroTitle.innerText = '';
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.innerText += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    heroTitle.classList.remove('typing-effect');
                    heroTitle.style.borderRight = 'none';
                }
            };
            typeWriter();
        }, 500);
    }
    
    // === ANIMACIÓN DE CONTADORES ===
    const animateNumber = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const updateNumber = () => {
            start += increment;
            if (start < target) {
                element.innerText = Math.floor(start);
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = target;
            }
        };
        updateNumber();
    };
    
    // Detectar si hay elementos con clase stat-number
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target') || element.innerText);
                    animateNumber(element, target);
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    // === EFECTO PARALLAX EN EL HERO ===
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
        });
    }
    
    // === ANIMACIÓN AL ENVIAR FORMULARIO ===
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('btn-loading')) {
                const originalText = submitBtn.innerHTML;
                submitBtn.classList.add('btn-loading');
                submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
                
                setTimeout(() => {
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.innerHTML = originalText;
                }, 2000);
            }
        });
    });
    
    // === EFECTO DE FLOTACIÓN EN ICONOS ===
    const floatingIcons = document.querySelectorAll('.service-icon i, .catalog-item-image i');
    floatingIcons.forEach(icon => {
        icon.classList.add('floating');
    });
    
})();