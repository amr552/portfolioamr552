const App = {
    data: {},
    state: {
        theme: localStorage.getItem('theme') || 'light',
        activeSkill: null,
        activeCertFilter: 'all',
        activeProjectFilter: 'all'
    },

    init: async () => {
        App.setupTheme();
        await App.loadData();

        App.renderHeaderComponents();
        App.renderFooter();

        // Page specific rendering
        if (window.location.pathname.includes('certificates.html')) {
            App.renderCertificatesPage();
        } else {
            App.renderHero();
            App.renderSkills();
            App.renderTimeline();
            App.renderProjects();

            // Render Project Categories on Index
            App.renderProjectCategories();
        }

        App.setupInteractions();
    },

    // ... (Previous Helper Functions: setupTheme, toggleTheme, loadData, renderHeaderComponents, renderFooter, setText, getIcon) ...
    setupTheme: () => {
        document.documentElement.setAttribute('data-theme', App.state.theme);
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerText = App.state.theme === 'light' ? '🌙' : '☀️';
    },

    toggleTheme: () => {
        App.state.theme = App.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', App.state.theme);
        App.setupTheme();
    },

    loadData: async () => {
        const fetchJSON = (file) => fetch(`assets/data/${file}`).then(r => r.json());
        try {
            const [profile, projects, timeline, socials, certificates] = await Promise.all([
                fetchJSON('profile.json'),
                fetchJSON('projects.json'),
                fetchJSON('timeline.json'),
                fetchJSON('socials.json'),
                fetchJSON('certificates.json')
            ]);
            App.data = { profile, projects, timeline, socials, certificates };
        } catch (e) {
            console.error("Data load failed", e);
        }
    },

    renderHeaderComponents: () => {
        const headerSocials = document.getElementById('header-socials');
        if (headerSocials && App.data.socials) {
            headerSocials.innerHTML = App.data.socials.slice(0, 3).map(s => `
                <a href="${s.url}" target="_blank" title="${s.platform}" class="icon-btn">
                    ${getIcon(s.icon)}
                </a>
            `).join('');
        }

        const cvBtn = document.getElementById('download-cv');
        if (cvBtn && App.data.profile.config?.cv_url) {
            cvBtn.href = App.data.profile.config.cv_url;
        }
    },

    renderFooter: () => {
        const container = document.getElementById('footer-socials');
        if (container && App.data.socials) {
            container.innerHTML = App.data.socials.map(s => `
                <a href="${s.url}" target="_blank" title="${s.platform}">
                    ${getIcon(s.icon)}
                </a>
            `).join('');
        }
    },

    renderHero: () => {
        const p = App.data.profile.basics;
        setText('hero-name', p.name);
        setText('hero-role', p.role);
        setText('hero-summary', p.label);

        // Render Profile Photo
        const photoContainer = document.querySelector('.hero-photo');
        if (photoContainer && p.image) {
            photoContainer.innerHTML = `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">`;
        }
    },

    renderSkills: () => {
        const container = document.getElementById('skills-cloud');
        if (!container) return;
        const allSkills = new Set();
        App.data.projects.forEach(p => p.tech.forEach(t => allSkills.add(t)));
        App.data.timeline.forEach(t => { if (t.skills) t.skills.forEach(s => allSkills.add(s)); });
        container.innerHTML = Array.from(allSkills).sort().map(skill =>
            `<button class="skill-pill" onclick="App.filterBySkill('${skill}')">${skill}</button>`
        ).join('');
    },

    // --- Timeline Rendering ---
    renderTimeline: () => {
        const container = document.getElementById('timeline-list');
        if (!container) return;

        // Sort by date descending (Newest/Future first)
        const sortedTimeline = [...App.data.timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sortedTimeline.map((item) => {
            const relatedId = item.related_project_id ? `onclick="App.scrollToProject('${item.related_project_id}')" style="cursor:pointer;" title="Go to Project"` : '';
            return `
            <div class="timeline-entry" ${relatedId} data-skills="${item.skills ? item.skills.join(',') : ''}">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-role">${item.category} ${item.institution ? ' | ' + item.institution : ''}</div>
                <div class="timeline-desc">${item.description}</div>
            </div>
            `;
        }).join('');
    },

    // --- Projects Rendering & Categories ---
    renderProjectCategories: () => {
        const controls = document.querySelector('#projects .controls');
        if (!controls || document.getElementById('project-filters')) return; // Avoid duplicating

        const categoryDiv = document.createElement('div');
        categoryDiv.id = 'project-filters';
        categoryDiv.className = 'category-filters';
        categoryDiv.style.position = 'static'; // Not sticky here
        categoryDiv.style.margin = '20px 0';
        categoryDiv.style.background = 'transparent';

        categoryDiv.innerHTML = `
            <button class="cat-btn active" onclick="App.filterProjects('all', this)">All Projects</button>
            <button class="cat-btn" onclick="App.filterProjects('DS&DA', this)">DS & DA</button>
            <button class="cat-btn" onclick="App.filterProjects('ML&CV', this)">ML & CV</button>
            <button class="cat-btn" onclick="App.filterProjects('Agentic AI & Side Hustle', this)">Agentic AI & Side Hustle</button>
        `;

        controls.insertBefore(categoryDiv, controls.lastElementChild); // Insert before grid
    },

    filterProjects: (cat, btn) => {
        App.state.activeProjectFilter = cat;
        // Update Buttons
        document.querySelectorAll('#project-filters .cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        App.renderProjects();
    },

    renderProjects: () => {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        const skillFilter = App.state.activeSkill;
        const catFilter = App.state.activeProjectFilter;
        const search = document.getElementById('project-search')?.value.toLowerCase() || '';

        const projects = App.data.projects.filter(p => {
            const matchesSkill = !skillFilter || p.tech.includes(skillFilter) || p.tags.includes(skillFilter);
            const matchesSearch = !search || p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
            const matchesCat = catFilter === 'all' || p.category === catFilter;

            return matchesSkill && matchesSearch && matchesCat;
        });

        if (projects.length === 0) {
            container.innerHTML = `<p>No projects found matching your criteria.</p>`;
            return;
        }

        container.innerHTML = projects.map(p => {
            const imageHtml = p.image
                ? `<div class="project-image"><img src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.parentElement.style.background='#eee'"></div>`
                : '<div class="project-image" style="background:#ddd;"></div>';

            const techHtml = p.tech.map(t => `<span class="tag-chip">${t}</span>`).join('');
            const linksHtml = Object.entries(p.links).map(([key, url]) =>
                `<a href="${url}" target="_blank">${key.charAt(0).toUpperCase() + key.slice(1)} ↗</a>`
            ).join('');

            return `
            <div class="project-card" id="${p.id}">
                ${imageHtml}
                <div class="project-content">
                    <div class="project-header">
                        <div class="project-title">${p.title}</div>
                        <div class="project-status">${p.status}</div>
                    </div>
                    <div class="project-desc">${p.description}</div>
                    <div class="project-tags">${techHtml}</div>
                    <div class="project-links">${linksHtml}</div>
                </div>
            </div>
            `;
        }).join('');
    },

    // --- Certificates Page Logic ---
    renderCertificatesPage: () => {
        App.renderCertificateTimeline();
    },

    filterCertificates: (cat, btn) => {
        App.state.activeCertFilter = cat;
        // Update Buttons
        document.querySelectorAll('#cert-filters .cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        App.renderCertificateTimeline();
    },

    renderCertificateTimeline: () => {
        const container = document.getElementById('certificates-list');
        if (!container) return;

        const filter = App.state.activeCertFilter;
        let certs = App.data.certificates.filter(c => filter === 'all' || c.category === filter);

        // Sort by date descending (Newest/Future first)
        certs = certs.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = certs.map(c => {
            const statusClass = c.status ? `status-${c.status.toLowerCase().replace(' ', '-')}` : '';
            const isFuture = c.status === 'Future';
            const entryClass = isFuture ? 'timeline-entry future' : 'timeline-entry';

            const imageHtml = c.image
                ? `<img src="${c.image}" class="cert-image" alt="${c.title}" onerror="this.style.display='none'">`
                : '';

            return `
            <div class="${entryClass}">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${c.date}</div>
                
                ${c.status ? `<span class="status-badge ${statusClass}">${c.status}</span>` : ''}
                
                <div class="timeline-title">${c.title}</div>
                <div class="timeline-role">${c.issuer}</div>
                
                ${imageHtml}
                
                ${c.link && c.link !== '#' ? `<a href="${c.link}" target="_blank" style="font-size:0.9rem; color:var(--accent-color);">View Credential ↗</a>` : ''}
            </div>
            `;
        }).join('');
    },

    // --- Helpers ---
    filterBySkill: (skill) => {
        // ... (Same as before) ...
        if (App.state.activeSkill === skill) {
            App.state.activeSkill = null;
        } else {
            App.state.activeSkill = skill;
        }
        document.querySelectorAll('.skill-pill').forEach(btn => {
            if (btn.innerText === App.state.activeSkill) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        App.renderProjects();
        App.highlightTimeline(App.state.activeSkill);
    },

    highlightTimeline: (skill) => {
        const entries = document.querySelectorAll('.timeline-entry');
        entries.forEach(e => e.classList.remove('highlight'));
        if (!skill) return;
        entries.forEach(e => {
            const skills = e.getAttribute('data-skills');
            if (skills && skills.includes(skill)) e.classList.add('highlight');
        });
    },

    scrollToProject: (pid) => {
        const el = document.getElementById(pid);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.borderColor = 'var(--accent-color)';
            setTimeout(() => el.style.borderColor = 'var(--border-color)', 2000);
        }
    },

    setupInteractions: () => {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.addEventListener('click', App.toggleTheme);

        const searchInput = document.getElementById('project-search');
        if (searchInput) searchInput.addEventListener('input', App.renderProjects);

        // Modal logic (if present on index)
        const modal = document.getElementById('qr-modal');
        const btn = document.getElementById('qr-trigger');
        const close = document.querySelector('.close-modal');
        if (btn && modal) {
            btn.onclick = () => modal.classList.remove('hidden');
            close.onclick = () => modal.classList.add('hidden');
            window.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); }
        }
    }
};

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function getIcon(name) {
    // ... (Same SVG map) ...
    const icons = {
        'github': `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23 .653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
        'kaggle': `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.825 23.859c-.022.092-.117.141-.285.141h-3.139c-.187 0-.351-.082-.493-.248l-5.178-6.589-1.448 1.374v5.111c0 .254-.117.381-.35.381h-2.58c-.233 0-.35-.127-.35-.381v-23.296c0-.254.117-.381.35-.381h2.58c.233 0 .35.127.35.381v14.128l7.633-8.868c.131-.152.3-.229.506-.229h3.139c.168 0 .263.049.285.147.037.158-.028.29-.196.398l-5.637 5.286 6.002 11.979c.121.235.158.397.112.486z"/></svg>`,
        'mail': `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
        'default': `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="12" cy="12" r="10"/></svg>`
    };
    return icons[name.toLowerCase()] || icons['default'];
}

document.addEventListener('DOMContentLoaded', App.init);
