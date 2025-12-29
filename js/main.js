let currentPage = 'intro';

function navigateTo(page) {
    currentPage = page;
    renderNavigation(page);
    
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
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('mainNav').style.display = 'block';
        navigateTo('home');
    }, 4000);
});
