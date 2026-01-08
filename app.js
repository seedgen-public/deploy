// 설정
const CONFIG = {
    owner: 'seedgen-public',
    repo: 'deploy',
    apiBase: 'https://api.github.com'
};

// DOM 요소
const elements = {
    releaseList: document.getElementById('release-list'),
    refreshBtn: document.getElementById('refresh-btn')
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadReleases();
    setupEventListeners();
});

function setupEventListeners() {
    elements.refreshBtn.addEventListener('click', loadReleases);
}

// GitHub API 호출 (인증 없이)
async function githubAPI(endpoint) {
    const url = `${CONFIG.apiBase}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// 릴리즈 목록 로드
async function loadReleases() {
    elements.releaseList.innerHTML = '<p class="loading">릴리즈 로딩 중...</p>';

    try {
        const releases = await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}/releases`);

        if (releases.length === 0) {
            elements.releaseList.innerHTML = `
                <div class="empty">
                    <p>아직 릴리즈가 없습니다.</p>
                    <p class="hint">release.ps1을 실행하여 첫 릴리즈를 생성하세요.</p>
                </div>
            `;
            return;
        }

        elements.releaseList.innerHTML = releases.map(release => createReleaseItem(release)).join('');

    } catch (error) {
        elements.releaseList.innerHTML = `
            <div class="error">
                <p>릴리즈를 불러올 수 없습니다.</p>
                <p class="hint">${error.message}</p>
            </div>
        `;
    }
}

// 릴리즈 아이템 HTML 생성
function createReleaseItem(release) {
    const date = new Date(release.published_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const tagClass = release.prerelease ? 'release-tag prerelease' : 'release-tag';

    // Asset 파일들
    let assetsHtml = '';
    if (release.assets && release.assets.length > 0) {
        assetsHtml = `
            <div class="assets-section">
                <h4>다운로드 파일</h4>
                <div class="assets-grid">
                    ${release.assets.map(asset => createAssetItem(asset)).join('')}
                </div>
            </div>
        `;
    } else {
        assetsHtml = '<p class="no-assets">첨부된 파일이 없습니다.</p>';
    }

    // 릴리즈 본문 (마크다운 간단 처리)
    let bodyHtml = '';
    if (release.body) {
        bodyHtml = `<div class="release-body">${formatReleaseBody(release.body)}</div>`;
    }

    return `
        <div class="release-item">
            <div class="release-header">
                <div class="release-info">
                    <span class="release-title">${release.name || release.tag_name}</span>
                    <span class="${tagClass}">${release.tag_name}</span>
                    ${release.prerelease ? '<span class="prerelease-badge">Pre-release</span>' : ''}
                </div>
                <span class="release-date">${date}</span>
            </div>
            ${bodyHtml}
            ${assetsHtml}
        </div>
    `;
}

// Asset 아이템 HTML 생성
function createAssetItem(asset) {
    const icon = getFileIcon(asset.name);
    const size = formatSize(asset.size);

    return `
        <a href="${asset.browser_download_url}" class="asset-item" download>
            <span class="asset-icon">${icon}</span>
            <span class="asset-name">${asset.name}</span>
            <span class="asset-size">${size}</span>
            <span class="download-icon">⬇️</span>
        </a>
    `;
}

// 파일 아이콘
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'ps1': '🔷',
        'sh': '🔶',
        'bat': '🟦',
        'cmd': '🟦',
        'py': '🐍',
        'zip': '📦',
        'tar': '📦',
        'gz': '📦'
    };
    return icons[ext] || '📄';
}

// 파일 크기 포맷
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 릴리즈 본문 간단 포맷
function formatReleaseBody(body) {
    return body
        .replace(/^## (.+)$/gm, '<h4>$1</h4>')
        .replace(/^- \*\*(.+?)\*\* \((.+?)\)$/gm, '<div class="script-item"><strong>$1</strong> <span class="category">$2</span></div>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n/g, '');
}
