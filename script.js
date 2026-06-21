document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu if open

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // 3D Tilt Effect for Glass Card
    const card = document.querySelector('.glass-card');
    
    if(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition when moving for instant follow
        });
    }
    
    // Form submission via Web3Forms AJAX
    const form = document.querySelector('.contact-form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const accessKeyInput = form.querySelector('[name="access_key"]');
            if (accessKeyInput && accessKeyInput.value === 'TUTAJ_WKLEJ_SWOJ_KLUCZ') {
                alert('Musisz najpierw wygenerować klucz na stronie Web3Forms.com i wkleić go w pliku index.html (w miejscu TUTAJ_WKLEJ_SWOJ_KLUCZ) żeby wiadomości docierały na Twojego maila.');
                return;
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;
            btn.innerText = 'Wysyłanie...';
            btn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                const result = await response.json();
                if (response.status === 200) {
                    alert('Dziękujemy! Wiadomość została pomyślnie wysłana.');
                    form.reset();
                } else {
                    alert('Błąd wysyłania: ' + result.message);
                }
            } catch (error) {
                alert('Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie później.');
            } finally {
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });
    }
});
