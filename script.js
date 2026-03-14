document.addEventListener('DOMContentLoaded', () => {
    // === 1. DEFINISI ELEMEN ===
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const stickyBtn = document.getElementById('stickyArrowBtn');
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');

    // === 2. NAVIGASI MOBILE ===
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // === 3. SMOOTH SCROLL & AUTO-CLOSE MENU ===
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({ 
                    top: targetElement.offsetTop - 70, 
                    behavior: 'smooth' 
                });

                // Update status aktif secara manual
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }

            // Tutup menu mobile setelah klik
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('show');
        });
    });

    // === 4. SCROLL SPY (Highlight Menu saat Scroll) ===
    const spyOptions = { 
        threshold: [0.2, 0.5],
        rootMargin: "-20% 0px -20% 0px" 
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

    document.querySelectorAll('section[id], footer[id]').forEach(el => spyObserver.observe(el));

    // === 5. FADE IN ANIMATION (Optimasi Mobile) ===
    const fadeOptions = { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px" 
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal'); // Pastikan CSS menggunakan .reveal
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    // Daftarkan semua elemen yang ingin diberi animasi
    document.querySelectorAll('section, .project-card, .bg-card, .cert-card, .tech-card').forEach(el => {
        el.classList.add('fade-in-section'); // Tambahkan class dasar via JS agar aman
        fadeObserver.observe(el);
    });

    // === 6. STICKY ARROW BUTTON (Scroll Logic) ===
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

    // === 7. FORM SUBMISSION (Vercel API & Supabase) ===
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Sending...';

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            message: document.getElementById('userMessage').value,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }

            // Berhasil
            successMsg.classList.remove('hidden');
            contactForm.reset();
            setTimeout(() => successMsg.classList.add('hidden'), 5000);

        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // === 8. RIPPLE EFFECT ===
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
            setTimeout(() => ripple.remove(), 600);
        });
    });
});