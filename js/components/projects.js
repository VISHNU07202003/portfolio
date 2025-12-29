function renderProjectsPage() {
    const projectsHTML = projectsData.map(project => `
        <div class="project-card" onclick="window.open('${project.github}', '_blank')">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
        </div>
    `).join('');

    return `
        <div class="content-container">
            <h2 class="page-title">Projects</h2>
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        </div>
    `;
}
