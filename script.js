document.addEventListener('DOMContentLoaded', () => {
    // Pastikan urutan ID sesuai dengan struktur HTML Anda
    const sectionsArr = ['hero', 'about', 'projects', 'tech', 'certification', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const stickyBtn = document.getElementById('stickyArrowBtn');

    // 1. Mobile Menu Toggle
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // 2. Smooth Scroll & Manual Highlight
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset 70px untuk navbar fixed
                window.scrollTo({ 
                    top: targetElement.offsetTop - 70, 
                    behavior: 'smooth' 
                });

                // Paksa aktifkan menu saat diklik (menghindari delay observer)
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }

            // Tutup menu mobile
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('show');
        });
    });

    // 3. Scroll Spy (Intersection Observer)
    const spyOptions = { 
        threshold: [0.2, 0.5], // Deteksi ganda untuk akurasi
        rootMargin: "-20% 0px -20% 0px" // Fokus pada area tengah layar
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, spyOptions);

    // Memantau Section DAN Footer (agar Contact terdeteksi)
    document.querySelectorAll('section[id], footer[id]').forEach(el => spyObserver.observe(el));

    // 4. Fade In Animation on Scroll
    const fadeOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-element');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    document.querySelectorAll('section, .project-card, .bg-card, .cert-card').forEach(el => fadeObserver.observe(el));

    // 5. Sticky Arrow Button Logic (Single vs Double Click)
    let clickCount = 0;
    let clickTimer = null;

    stickyBtn?.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                if (clickCount === 1) {
                    // Single click: Ke Section Sebelumnya
                    const currentPos = window.scrollY + 100;
                    const allSects = [...document.querySelectorAll('section[id], footer[id]')];
                    const currentIndex = allSects.findLastIndex(s => s.offsetTop <= currentPos);
                    
                    if (currentIndex > 0) {
                        const prev = allSects[currentIndex - 1];
                        window.scrollTo({ top: prev.offsetTop - 70, behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
                clickCount = 0;
            }, 300);
        } else {
            // Double click: Langsung ke Top
            clearTimeout(clickTimer);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            clickCount = 0;
        }
    });

    // 6. Ripple Effect (Tombol Interaktif)
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});