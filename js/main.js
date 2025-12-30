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

// Letter-by-letter trail effect (text appears as dino passes)
function letterTrailEffect(text, element, startDelay = 0) {
    const letters = text.split('');
    element.innerHTML = letters.map(letter => 
        `<span>${letter === ' ' ? '&nbsp;' : letter}</span>`
    ).join('');
    
    const spans = element.querySelectorAll('span');
    const letterDelay = 100; // milliseconds between each letter
    
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('show');
        }, startDelay + (index * letterDelay));
    });
    
    return startDelay + (letters.length * letterDelay);
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
    const welcomeText = document.querySelector('.welcome-text');
    const typewriterEl = document.querySelector('.typewriter');
    
    // Show text container immediately but letters hidden
    welcomeText.style.display = 'block';
    
    // Start revealing letters after 500ms delay (dino starts running)
    const totalTextTime = letterTrailEffect('WELCOME TO MY WORKSPACE', typewriterEl, 500);
    
    // Wait for all letters to appear + 1 second pause
    await new Promise(resolve => setTimeout(resolve, totalTextTime + 1000));
    
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
