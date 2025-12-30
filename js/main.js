let currentPage = 'intro';
let introCompleted = false;

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

// Typewriter effect
function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Skip intro function
function skipIntro() {
    if (introCompleted) return;
    
    introCompleted = true;
    const intro = document.getElementById('intro');
    intro.classList.add('fade-out');
    
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('mainNav').classList.add('show');
        navigateTo('home');
    }, 800);
}

// Dino intro animation sequence
async function runDinoIntro() {
    const intro = document.getElementById('intro');
    const welcomeText = document.querySelector('.welcome-text');
    const typewriterEl = document.querySelector('.typewriter');
    
    // Wait for dino to run to center (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Show and type welcome text
    welcomeText.style.display = 'block';
    await typeWriter('WELCOME TO MY WORKSPACE', typewriterEl, 80);
    
    // Wait 1.5 seconds after text completes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Fade out and show main content
    if (!introCompleted) {
        skipIntro();
    }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    // Start dino intro
    runDinoIntro();

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
