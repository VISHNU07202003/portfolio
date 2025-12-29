function renderContactPage() {
    const contacts = [
        { name: 'GitHub', icon: '💻', url: 'https://github.com/VISHNU07202003' },
        { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/vishnu-sai-padyala-95317b24b/' },
        { name: 'Email', icon: '📧', url: 'mailto:padyalavishnusai@ufl.edu' },
        { name: 'Phone', icon: '📱', url: 'tel:+1234567890' },
        { name: 'LeetCode', icon: '⚡', url: 'https://leetcode.com/VISHNU07202003' }
    ];

    const contactsHTML = contacts.map(contact => `
        <a href="${contact.url}" 
           ${contact.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} 
           class="contact-item">
            <div class="contact-icon">
                <span>${contact.icon}</span>
            </div>
            <span class="contact-label">${contact.name}</span>
        </a>
    `).join('');

    return `
        <div class="content-container">
            <h2 class="page-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-icons">
                    ${contactsHTML}
                </div>
            </div>
        </div>
    `;
}
