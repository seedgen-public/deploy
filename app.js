// Config
const CONFIG = {
    owner: 'seedgen-public',
    repo: 'deploy',
    api: 'https://api.github.com'
};

// 카테고리 정의 (scriptlist.md 기반)
// 순서 중요: 더 구체적인 패턴(DBMS)을 먼저 체크해야 함
const CATEGORIES = [
    {
        name: 'DBMS',
        icon: '🗄️',
        desc: '데이터베이스',
        patterns: [
            { match: 'MySQL', platform: 'Linux', code: 'M' },
            { match: 'Oracle', platform: 'Linux', code: 'O' },
            { match: 'MSSQL', platform: 'Windows', code: 'S' },
            { match: 'PostgreSQL', platform: 'Linux', code: 'P' },
            { match: 'MariaDB', platform: 'Linux', code: '-' }
        ]
    },
    {
        name: 'WEB/WAS',
        icon: '🌐',
        desc: '웹/WAS',
        patterns: [
            { match: 'Apache', platform: '-', code: 'WA' },
            { match: 'Nginx', platform: '-', code: 'WN' },
            { match: 'Tomcat', platform: '-', code: 'WT' },
            { match: 'IIS', platform: 'Windows', code: 'WI' }
        ]
    },
    {
        name: 'PC',
        icon: '💻',
        desc: 'PC 진단',
        patterns: [
            { match: 'WindowsPC', platform: 'Windows', code: 'PC' },
            { match: 'PC_Check', platform: 'Windows', code: 'PC' }
        ]
    },
    {
        name: 'OS',
        icon: '🖥️',
        desc: '운영체제',
        patterns: [
            { match: 'Linux.sh', platform: 'RHEL', code: 'U' },
            { match: 'Ubuntu.sh', platform: 'Ubuntu', code: 'U' },
            { match: 'WindowsServer', platform: 'Windows Server', code: 'W' }
        ]
    }
];

// DOM
const els = {
    currentVersion: document.getElementById('current-version'),
    releaseDate: document.getElementById('release-date'),
    scriptsGrid: document.getElementById('scripts-grid'),
    historyToggle: document.getElementById('history-toggle'),
    historyList: document.getElementById('history-list')
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadReleases();
    els.historyToggle.addEventListener('click', toggleHistory);
});

// Toggle history
function toggleHistory() {
    els.historyToggle.classList.toggle('open');
    els.historyList.classList.toggle('hidden');
}

// Load releases
async function loadReleases() {
    try {
        const res = await fetch(`${CONFIG.api}/repos/${CONFIG.owner}/${CONFIG.repo}/releases`);
        if (!res.ok) throw new Error('릴리즈를 불러올 수 없습니다');

        const releases = await res.json();

        if (releases.length === 0) {
            els.scriptsGrid.innerHTML = '<div class="empty">릴리즈가 없습니다</div>';
            return;
        }

        // 최신 릴리즈
        renderCurrentRelease(releases[0]);

        // 이전 릴리즈들
        if (releases.length > 1) {
            renderHistory(releases.slice(1));
        } else {
            document.querySelector('.history-section').style.display = 'none';
        }

    } catch (err) {
        els.scriptsGrid.innerHTML = `<div class="error">${err.message}</div>`;
    }
}

// 파일 분류
function categorizeFile(filename) {
    for (const cat of CATEGORIES) {
        for (const p of cat.patterns) {
            if (filename.includes(p.match)) {
                return {
                    category: cat.name,
                    icon: cat.icon,
                    platform: p.platform,
                    code: p.code
                };
            }
        }
    }
    return { category: '기타', icon: '📄', platform: '-', code: '-' };
}

// Render current release
function renderCurrentRelease(release) {
    els.currentVersion.textContent = release.tag_name;

    // 릴리즈 날짜 표시
    if (release.published_at) {
        const date = new Date(release.published_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        els.releaseDate.textContent = `배포일: ${date}`;
    }

    if (!release.assets || release.assets.length === 0) {
        els.scriptsGrid.innerHTML = '<div class="empty">배포된 파일이 없습니다</div>';
        return;
    }

    // 카테고리별로 그룹화
    const groups = {};
    CATEGORIES.forEach(cat => groups[cat.name] = { icon: cat.icon, desc: cat.desc, files: [] });
    groups['기타'] = { icon: '📄', desc: '기타', files: [] };

    release.assets.forEach(asset => {
        const info = categorizeFile(asset.name);
        if (!groups[info.category]) {
            groups[info.category] = { icon: info.icon, desc: info.category, files: [] };
        }
        groups[info.category].files.push({
            ...asset,
            platform: info.platform,
            code: info.code
        });
    });

    // HTML 생성
    let html = '';
    for (const [catName, catData] of Object.entries(groups)) {
        if (catData.files.length === 0) continue;

        html += `
            <div class="category">
                <div class="category-header">
                    <span class="category-icon">${catData.icon}</span>
                    <span class="category-name">${catName}</span>
                    <span class="category-desc">${catData.desc}</span>
                    <span class="category-count">${catData.files.length}</span>
                </div>
                <div class="category-files">
                    ${catData.files.map(f => renderFile(f)).join('')}
                </div>
            </div>
        `;
    }

    els.scriptsGrid.innerHTML = html;
}

// Render file item
function renderFile(file) {
    const icon = getIcon(file.name);
    const size = formatSize(file.size);
    const ext = file.name.split('.').pop().toUpperCase();

    return `
        <a href="${file.browser_download_url}" class="file-item" download>
            <span class="file-icon">${icon}</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span class="file-platform">${file.platform}</span>
                    <span class="file-size">${size}</span>
                </div>
            </div>
            <span class="file-ext">${ext}</span>
        </a>
    `;
}

// Get file icon
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
    els.historyList.innerHTML = releases.map(r => {
        const date = new Date(r.published_at).toLocaleDateString('ko-KR');
        const count = r.assets ? r.assets.length : 0;
        return `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-version">${r.tag_name}</span>
                    <span class="history-date">${date}</span>
                    <span class="history-count">${count}개 파일</span>
                </div>
                <a href="${r.html_url}" target="_blank" class="history-link">GitHub에서 보기</a>
            </div>
        `;
    }).join('');
}
