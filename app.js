// Config
const CONFIG = {
    owner: 'seedgen-public',
    repo: 'deploy',
    api: 'https://api.github.com'
};

// 카테고리 (순서 중요: 구체적인 것 먼저)
const CATEGORIES = [
    {
        name: 'DBMS',
        icon: '🗄️',
        patterns: ['MySQL', 'Oracle', 'MSSQL', 'PostgreSQL', 'MariaDB']
    },
    {
        name: 'WEB/WAS',
        icon: '🌐',
        patterns: ['Apache', 'Nginx', 'Tomcat', 'IIS']
    },
    {
        name: 'PC',
        icon: '💻',
        patterns: ['WindowsPC', 'PC_Check']
    },
    {
        name: 'OS',
        icon: '🖥️',
        patterns: ['Linux', 'Ubuntu', 'WindowsServer']
    }
];

// DOM
const els = {
    version: document.getElementById('current-version'),
    date: document.getElementById('release-date'),
    container: document.getElementById('scripts-container'),
    historySection: document.getElementById('history-section'),
    historyList: document.getElementById('history-list')
};

// Init
document.addEventListener('DOMContentLoaded', loadReleases);

// Load releases
async function loadReleases() {
    try {
        const res = await fetch(`${CONFIG.api}/repos/${CONFIG.owner}/${CONFIG.repo}/releases`);
        if (!res.ok) throw new Error('릴리즈를 불러올 수 없습니다');

        const releases = await res.json();

        if (releases.length === 0) {
            els.container.innerHTML = '<div class="empty">릴리즈가 없습니다</div>';
            return;
        }

        renderRelease(releases[0]);

        if (releases.length > 1) {
            renderHistory(releases.slice(1));
        } else {
            els.historySection.style.display = 'none';
        }

    } catch (err) {
        els.container.innerHTML = `<div class="error">${err.message}</div>`;
    }
}

// 파일 분류
function getCategory(filename) {
    for (const cat of CATEGORIES) {
        if (cat.patterns.some(p => filename.includes(p))) {
            return cat;
        }
    }
    return { name: '기타', icon: '📄' };
}

// Render release
function renderRelease(release) {
    els.version.textContent = release.tag_name;

    if (release.published_at) {
        els.date.textContent = new Date(release.published_at).toLocaleDateString('ko-KR');
    }

    if (!release.assets || release.assets.length === 0) {
        els.container.innerHTML = '<div class="empty">배포된 파일이 없습니다</div>';
        return;
    }

    // 카테고리별 그룹화
    const groups = {};
    CATEGORIES.forEach(c => groups[c.name] = { icon: c.icon, files: [] });
    groups['기타'] = { icon: '📄', files: [] };

    release.assets.forEach(asset => {
        const cat = getCategory(asset.name);
        groups[cat.name].files.push(asset);
    });

    // 렌더링
    let html = '';
    for (const [name, data] of Object.entries(groups)) {
        if (data.files.length === 0) continue;

        html += `
            <div class="category">
                <div class="category-header">
                    <span class="icon">${data.icon}</span>
                    <span>${name}</span>
                    <span class="count">${data.files.length}개</span>
                </div>
                <div class="file-list">
                    ${data.files.map(f => `
                        <a href="${f.browser_download_url}" class="file-item" download>
                            <span class="file-icon">${getIcon(f.name)}</span>
                            <span class="file-name">${f.name}</span>
                            <span class="file-size">${formatSize(f.size)}</span>
                            <span class="file-ext">${f.name.split('.').pop().toUpperCase()}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    els.container.innerHTML = html;
}

// File icon
function getIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    return { ps1: '🔷', sh: '🔶', bat: '🟦', cmd: '🟦', py: '🐍' }[ext] || '📄';
}

// Format size
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Render history
function renderHistory(releases) {
    els.historyList.innerHTML = releases.map(r => `
        <div class="history-item">
            <span class="history-version">${r.tag_name}</span>
            <span class="history-date">${new Date(r.published_at).toLocaleDateString('ko-KR')}</span>
            <span class="history-count">${r.assets?.length || 0}개 파일</span>
            <a href="${r.html_url}" target="_blank" class="history-link">GitHub</a>
        </div>
    `).join('');
}
