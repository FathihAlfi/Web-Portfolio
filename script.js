// Smooth Scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Efek Fade In saat scroll ke konten berikutnya
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-element');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Tambahkan observer ke semua section, div dengan class 'bg-card', dan elemen penting lainnya
document.querySelectorAll('section, .bg-card, h2, h3').forEach(element => {
    observer.observe(element);
});

// Efek sederhana saat halaman di-scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
    } else {
        nav.style.boxShadow = "none";
    }
});

// Sticky Arrow Button - Single Click & Double Click Functionality
const stickyArrowBtn = document.getElementById('stickyArrowBtn');
let clickCount = 0;
let clickTimer = null;

// Daftar semua section yang ada di halaman (sesuai urutan)
const sections = ['about', 'projects', 'tech', 'certification', 'contact'];

// Fungsi untuk mendapatkan section saat ini berdasarkan scroll position
function getCurrentSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            return i;
        }
    }
    return 0;
}

// Single click: scroll ke section sebelumnya
// Double click: scroll ke atas (halaman paling atas)
stickyArrowBtn.addEventListener('click', function () {
    clickCount++;
    
    if (clickCount === 1) {
        // Single click - tunggu 300ms untuk pastikan bukan double click
        clickTimer = setTimeout(() => {
            const currentIndex = getCurrentSection();
            
            // Jika sudah di section pertama, scroll ke top
            if (currentIndex <= 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Scroll ke section sebelumnya
                const previousSection = document.getElementById(sections[currentIndex - 1]);
                if (previousSection) {
                    previousSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            clickCount = 0;
        }, 300);
    } else if (clickCount === 2) {
        // Double click - scroll ke atas langsung
        clearTimeout(clickTimer);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        clickCount = 0;
    }
});
