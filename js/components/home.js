function renderHomePage() {
    return `
        <div class="home-container">
            <p class="home-tagline">
                A creative mind building clean, functional digital experiences.
            </p>
            <canvas id="threeCanvas" width="500" height="400"></canvas>
            <div class="cta-buttons">
                <button class="btn btn-primary" onclick="navigateTo('projects')">
                    View Projects
                </button>
                <button class="btn btn-secondary" onclick="navigateTo('contact')">
                    Get in Touch
                </button>
            </div>
        </div>
    `;
}
