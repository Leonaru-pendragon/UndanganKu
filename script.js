document.addEventListener('DOMContentLoaded', function() {

    // 1. ANIMASI MEMBUKA UNDANGAN (Cover)
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('openBtn');
    const bgMusic = document.getElementById('bgMusic');
    const bottomNav = document.getElementById('bottom-nav');

    if (openBtn) {
        openBtn.addEventListener('click', function() {
            // Tutup cover dengan animasi slide up
            cover.style.transform = 'translateY(-100%)';
            
            // Tampilkan konten utama setelah animasi selesai
            setTimeout(() => {
                // Sembunyikan cover sepenuhnya
                cover.style.display = 'none';
                cover.classList.add('hidden');
                
                // Tampilkan konten utama
                mainContent.classList.remove('hidden');
                mainContent.classList.add('visible');
                
                // Tampilkan bottom nav setelah cover terbuka
                if (bottomNav) {
                    bottomNav.classList.remove('hidden');
                    bottomNav.classList.add('visible');
                }
                
                // Putar musik otomatis setelah cover terbuka
                bgMusic.play().catch(error => {
                    console.log("Autoplay dicegah oleh browser, user harus klik tombol musik");
                });
                
                // Aktifkan scroll animation untuk konten utama
                initScrollReveal();
                
            }, 1500);
        });
    }


    // 2. SCROLL REVEAL ANIMATION
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealOnScroll.observe(el));
    }


    // 3. COUNTDOWN TIMER
    const weddingDate = new Date("April 12, 2026 08:00:00").getTime();

    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(countdownInterval);
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) {
                countdownEl.innerHTML = "<h3>Alhamdulillah, Acara Telah Selesai</h3>";
            }
        }
    }, 1000);


    // 4. KONTROL MUSIK
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = musicBtn.querySelector('i');

    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.play();
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-pause');
                musicBtn.style.animation = "float 2s infinite";
            } else {
                bgMusic.pause();
                musicIcon.classList.remove('fa-pause');
                musicIcon.classList.add('fa-music');
                musicBtn.style.animation = "none";
            }
        });
    }


    // 5. FLOATING BOTTOM NAVIGATION (Smooth Scroll)
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // 6. SCROLL SPY (Highlight Menu Aktif)
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // 7. FORM DOA & UCAPAN
    const doaForm = document.getElementById('doaForm');
    const doaList = document.getElementById('doaList');

    if (doaForm) {
        doaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('doaName').value;
            const message = document.getElementById('doaMessage').value;
            const date = new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const newDoa = document.createElement('div');
            newDoa.className = 'doa-item';
            newDoa.innerHTML = `
                <div class="doa-header">
                    <div class="doa-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="doa-info">
                        <h4>${name}</h4>
                        <span class="doa-date">${date}</span>
                    </div>
                </div>
                <p class="doa-content">${message}</p>
            `;

            if (doaList) {
                doaList.insertBefore(newDoa, doaList.firstChild);
            }

            doaForm.reset();

            alert('Terima kasih! Doa Anda telah terkirim.');
        });
    }
});

// 8. COPY TO CLIPBOARD UNTUK REKENING (fungsi global)
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin: ' + text);
    }, function(err) {
        console.error('Gagal menyalin: ', err);
        // Fallback untuk browser lama
        alert('Nomor rekening: ' + text);
    });
};