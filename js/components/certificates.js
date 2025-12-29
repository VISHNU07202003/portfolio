function renderCertificatesPage() {
    const certsHTML = certificatesData.map(cert => `
        <div class="cert-item">
            <div class="cert-image">
                <img src="${cert.image}" alt="${cert.title}">
            </div>
            <h3 class="cert-title">${cert.title}</h3>
        </div>
    `).join('');

    return `
        <div class="content-container">
            <h2 class="page-title">Certificates</h2>
            <div class="certificates-container">
                ${certsHTML}
            </div>
        </div>
    `;
}
