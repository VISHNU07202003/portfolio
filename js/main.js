let currentPage = 'intro';

function updateNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === currentPage) {
            btn.classList.add('active');
        }
    });
}

function navigateTo(page) {
    currentPage = page;
    updateNav();
    
    const app = document.getElementById('app');
    
    switch(page) {
        case 'home':
            app.innerHTML = renderHomePage();
            setTimeout(initThreeAnimation, 100);
            break;
        case 'about':
            app.innerHTML = renderAboutPage();
            break;
        case 'projects':
            app.innerHTML = renderProjectsPage();
            break;
        case 'certificates':
            app.innerHTML = renderCertificatesPage();
            break;
        case 'contact':
            app.innerHTML = renderContactPage();
            break;
    }
}

// Initialize app - NEW INTRO ANIMATION
window.addEventListener('DOMContentLoaded', () => {
    // Wait 2.5 seconds, then fade out intro
    setTimeout(() => {
        const intro = document.getElementById('intro');
        intro.classList.add('fade-out');
        
        // After fade completes (500ms), hide intro and show main content
        setTimeout(() => {
            intro.style.display = 'none';
            document.getElementById('mainNav').classList.add('show');
            navigateTo('home');
        }, 500);
    }, 2500);

    // Navigation event listeners
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn')) {
            navigateTo(e.target.dataset.page);
        }
        if (e.target.classList.contains('logo')) {
            navigateTo('home');
        }
    });
});
