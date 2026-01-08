// Config
const CONFIG = {
    owner: 'seedgen-public',
    repo: 'deploy',
    api: 'https://api.github.com'
};

// 카테고리 정의 (파일명 패턴 → 카테고리)
const CATEGORIES = {
    'OS': { icon: '🖥️', patterns: ['Linux', 'Windows', 'Ubuntu', 'RHEL', 'Server'] },
    'DBMS': { icon: '🗄️', patterns: ['SQL', 'Oracle', 'Maria', 'Postgre', 'MySQL'] },
    'PC': { icon: '💻', patterns: ['PC', 'Client'] },
    '기타': { icon: '📄', patterns: [] }
};

// DOM
const els = {
    currentVersion: document.getElementById('current-version'),
    currentScripts: document.getElementById('current-scripts'),
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
        if (!res.ok) throw new Error('Failed to load');

        const releases = await res.json();

        if (releases.length === 0) {
            els.currentScripts.innerHTML = '<div class="empty">릴리즈가 없습니다</div>';
            return;
        }

        // 최신 릴리즈
        const latest = releases[0];
        renderCurrentRelease(latest);

        // 이전 릴리즈들
        if (releases.length > 1) {
            renderHistory(releases.slice(1));
        } else {
            document.querySelector('.history-section').style.display = 'none';
        }

    } catch (err) {
        els.currentScripts.innerHTML = `<div class="error">${err.message}</div>`;
    }
}

// Render current release
function renderCurrentRelease(release) {
    els.currentVersion.textContent = release.tag_name;

    if (!release.assets || release.assets.length === 0) {
        els.currentScripts.innerHTML = '<div class="empty">파일이 없습니다</div>';
        return;
    }

    // 카테고리별로 분류
    const categorized = categorizeFiles(release.assets);

    let html = '';
    for (const [category, files] of Object.entries(categorized)) {
        if (files.length === 0) continue;

        const info = CATEGORIES[category] || CATEGORIES['기타'];
        html += `
            <div class="category">
                <div class="category-header">
                    <span class="category-icon">${info.icon}</span>
                    <span>${category}</span>
                    <span style="color: var(--gray-500); font-weight: normal; font-size: 0.8rem;">(${files.length})</span>
                </div>
                <div class="category-files">
                    ${files.map(f => renderFile(f)).join('')}
                </div>
            </div>
        `;
    }

    els.currentScripts.innerHTML = html;
}

// Categorize files
function categorizeFiles(assets) {
    const result = {};
    Object.keys(CATEGORIES).forEach(cat => result[cat] = []);

    assets.forEach(asset => {
        let matched = false;
        for (const [category, info] of Object.entries(CATEGORIES)) {
            if (category === '기타') continue;
            if (info.patterns.some(p => asset.name.toLowerCase().includes(p.toLowerCase()))) {
                result[category].push(asset);
                matched = true;
                break;
            }
        }
        if (!matched) {
            result['기타'].push(asset);
        }
    });

    return result;
}

// Render file item
function renderFile(asset) {
    const icon = getIcon(asset.name);
    const size = formatSize(asset.size);

    return `
        <a href="${asset.browser_download_url}" class="file-item" download>
            <span class="file-icon">${icon}</span>
            <div class="file-info">
                <div class="file-name">${asset.name}</div>
                <div class="file-meta">${size}</div>
            </div>
            <span class="download-btn">↓</span>
        </a>
    `;
}

// Get file icon
function getIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    const icons = { ps1: '🔷', sh: '🔶', bat: '🟦', cmd: '🟦', py: '🐍' };
    return icons[ext] || '📄';
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
        return `
            <div class="history-item">
                <div class="history-info">
                    <span class="history-version">${r.tag_name}</span>
                    <span class="history-date">${date}</span>
                </div>
                <a href="${r.html_url}" target="_blank" class="history-link">보기 →</a>
            </div>
        `;
    }).join('');
}
