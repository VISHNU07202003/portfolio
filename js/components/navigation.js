function renderNavigation(currentPage) {
    const nav = document.getElementById('mainNav');
    const pages = ['home', 'about', 'projects', 'certificates', 'contact'];
    
    nav.innerHTML = `
        <div class="nav-container">
            <div class="logo" onclick="navigateTo('home')">VISHNU</div>
            <div class="nav-links">
                ${pages.map(page => `
                    <button 
                        class="${currentPage === page ? 'active' : ''}" 
                        onclick="navigateTo('${page}')"
                    >
                        ${page}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}
