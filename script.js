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


// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Sending...';

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            message: document.getElementById('userMessage').value,
        };

        try {
            // Panggil API Vercel lokal (relatif ke domain)
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to send message');

            // Berhasil
            successMsg.classList.remove('hidden');
            contactForm.reset();
            setTimeout(() => successMsg.classList.add('hidden'), 5000);

        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });
});


// Konfigurasi Supabase (Ganti dengan URL dan API Key dari Dashboard Supabase Anda)
// const SUPABASE_URL = 'URL_PROYEK_SUPABASE_ANDA';
// const SUPABASE_ANON_KEY = 'ANON_KEY_SUPABASE_ANDA';
// const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// document.addEventListener('DOMContentLoaded', () => {
//     const contactForm = document.getElementById('contactForm');
//     const submitBtn = document.getElementById('submitBtn');
//     const successMsg = document.getElementById('successMsg');

//     contactForm?.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         // Ubah tampilan tombol saat loading
//         const originalBtnText = submitBtn.innerHTML;
//         submitBtn.disabled = true;
//         submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Sending...';

//         // Ambil data
//         const formData = {
//             name: document.getElementById('userName').value,
//             email: document.getElementById('userEmail').value,
//             message: document.getElementById('userMessage').value,
//         };

//         try {
//             // Simpan ke tabel 'contacts' di Supabase
//             const { error } = await _supabase
//                 .from('contacts')
//                 .insert([formData]);

//             if (error) throw error;

//             // Jika Berhasil
//             successMsg.classList.remove('hidden');
//             contactForm.reset();
            
//             // Sembunyikan pesan sukses setelah 5 detik
//             setTimeout(() => successMsg.classList.add('hidden'), 5000);

//         } catch (err) {
//             alert('Error: ' + err.message);
//         } finally {
//             // Kembalikan tombol ke keadaan semula
//             submitBtn.disabled = false;
//             submitBtn.innerHTML = originalBtnText;
//         }
//     });
// });