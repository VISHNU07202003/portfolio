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

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    // Intro animation - 2 seconds
    setTimeout(() => {
        const intro = document.getElementById('intro');
        intro.classList.add('fade-out');
        
        setTimeout(() => {
            intro.style.display = 'none';
            document.getElementById('mainNav').classList.add('show');
            navigateTo('home');
        }, 300);
    }, 2000);

    // Navigation event listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.page);
        });
    });

    document.querySelector('.logo').addEventListener('click', () => {
        navigateTo('home');
    });
});
