// 설정
const CONFIG = {
    owner: 'seedgen-public',
    repo: 'script',
    apiBase: 'https://api.github.com'
};

// 상태
let state = {
    token: null,
    currentPath: '',
    connected: false
};

// DOM 요소
const elements = {
    tokenInput: document.getElementById('token-input'),
    saveToken: document.getElementById('save-token'),
    connectBtn: document.getElementById('connect-btn'),
    disconnectBtn: document.getElementById('disconnect-btn'),
    authSection: document.getElementById('auth-section'),
    statusSection: document.getElementById('status-section'),
    connectionStatus: document.getElementById('connection-status'),
    tabNav: document.getElementById('tab-nav'),
    filesTab: document.getElementById('files-tab'),
    releasesTab: document.getElementById('releases-tab'),
    fileList: document.getElementById('file-list'),
    releaseList: document.getElementById('release-list'),
    currentPath: document.getElementById('current-path'),
    refreshBtn: document.getElementById('refresh-btn'),
    createReleaseBtn: document.getElementById('create-release-btn'),
    releaseModal: document.getElementById('release-modal'),
    releaseForm: document.getElementById('release-form')
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    // 저장된 토큰 확인
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
        elements.tokenInput.value = savedToken;
        elements.saveToken.checked = true;
        // 자동 연결 시도
        connect();
    }
}

function setupEventListeners() {
    // 연결 버튼
    elements.connectBtn.addEventListener('click', connect);
    elements.disconnectBtn.addEventListener('click', disconnect);

    // 토큰 입력 엔터키
    elements.tokenInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') connect();
    });

    // 탭 전환
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // 새로고침
    elements.refreshBtn.addEventListener('click', () => loadFiles(state.currentPath));

    // 릴리즈 생성
    elements.createReleaseBtn.addEventListener('click', () => showModal());

    // 모달 닫기
    document.querySelector('.modal-close').addEventListener('click', hideModal);
    document.querySelector('.modal-cancel').addEventListener('click', hideModal);
    elements.releaseModal.addEventListener('click', (e) => {
        if (e.target === elements.releaseModal) hideModal();
    });

    // 릴리즈 폼 제출
    elements.releaseForm.addEventListener('submit', handleCreateRelease);
}

// GitHub API 호출
async function githubAPI(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${CONFIG.apiBase}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `token ${state.token}`,
            'Accept': 'application/vnd.github.v3+json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// 연결
async function connect() {
    const token = elements.tokenInput.value.trim();
    if (!token) {
        showToast('토큰을 입력해주세요', 'error');
        return;
    }

    elements.connectBtn.disabled = true;
    elements.connectBtn.textContent = '연결 중...';

    try {
        state.token = token;

        // 토큰 검증 및 리포 접근 확인
        const repo = await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}`);

        state.connected = true;

        // 토큰 저장
        if (elements.saveToken.checked) {
            localStorage.setItem('github_token', token);
        }

        // UI 업데이트
        elements.authSection.classList.add('hidden');
        elements.statusSection.classList.remove('hidden');
        elements.tabNav.classList.remove('hidden');
        elements.connectionStatus.textContent = `${repo.full_name} 연결됨`;

        // 파일 목록 로드
        switchTab('files');

        showToast('연결 성공!', 'success');
    } catch (error) {
        state.token = null;
        state.connected = false;
        showToast(`연결 실패: ${error.message}`, 'error');
    } finally {
        elements.connectBtn.disabled = false;
        elements.connectBtn.textContent = '연결';
    }
}

// 연결 해제
function disconnect() {
    state.token = null;
    state.connected = false;
    state.currentPath = '';

    localStorage.removeItem('github_token');

    elements.tokenInput.value = '';
    elements.saveToken.checked = false;
    elements.authSection.classList.remove('hidden');
    elements.statusSection.classList.add('hidden');
    elements.tabNav.classList.add('hidden');
    elements.filesTab.classList.add('hidden');
    elements.releasesTab.classList.add('hidden');

    showToast('연결이 해제되었습니다');
}

// 탭 전환
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    elements.filesTab.classList.toggle('hidden', tab !== 'files');
    elements.releasesTab.classList.toggle('hidden', tab !== 'releases');

    if (tab === 'files') {
        loadFiles(state.currentPath);
    } else if (tab === 'releases') {
        loadReleases();
    }
}

// 파일 목록 로드
async function loadFiles(path = '') {
    state.currentPath = path;
    updateBreadcrumb(path);

    elements.fileList.innerHTML = '<p class="loading">로딩 중...</p>';

    try {
        const contents = await githubAPI(
            `/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`
        );

        if (!Array.isArray(contents)) {
            // 단일 파일인 경우
            elements.fileList.innerHTML = '<p class="empty">파일입니다</p>';
            return;
        }

        if (contents.length === 0) {
            elements.fileList.innerHTML = '<p class="empty">파일이 없습니다</p>';
            return;
        }

        // 폴더 먼저, 파일 나중에 정렬
        contents.sort((a, b) => {
            if (a.type === 'dir' && b.type !== 'dir') return -1;
            if (a.type !== 'dir' && b.type === 'dir') return 1;
            return a.name.localeCompare(b.name);
        });

        elements.fileList.innerHTML = contents.map(item => createFileItem(item)).join('');

        // 이벤트 리스너 추가
        elements.fileList.querySelectorAll('.file-info').forEach(el => {
            el.addEventListener('click', () => {
                const type = el.dataset.type;
                const path = el.dataset.path;
                if (type === 'dir') {
                    loadFiles(path);
                }
            });
        });

        elements.fileList.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => downloadFile(btn.dataset.path, btn.dataset.name));
        });

        elements.fileList.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => copyDownloadUrl(btn.dataset.path));
        });

    } catch (error) {
        elements.fileList.innerHTML = `<p class="error">오류: ${error.message}</p>`;
    }
}

// 파일 아이템 HTML 생성
function createFileItem(item) {
    const isDir = item.type === 'dir';
    const icon = isDir ? '📁' : getFileIcon(item.name);
    const size = isDir ? '' : formatSize(item.size);

    return `
        <div class="file-item">
            <div class="file-info" data-type="${item.type}" data-path="${item.path}">
                <span class="file-icon">${icon}</span>
                <span class="file-name">${item.name}</span>
                ${size ? `<span class="file-size">${size}</span>` : ''}
            </div>
            ${!isDir ? `
                <div class="file-actions">
                    <button class="btn-icon copy-btn" data-path="${item.path}" title="URL 복사">
                        📋
                    </button>
                    <button class="btn-icon download-btn" data-path="${item.path}" data-name="${item.name}" title="다운로드">
                        ⬇️
                    </button>
                </div>
            ` : ''}
        </div>
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
        'js': '🟨',
        'json': '📄',
        'md': '📝',
        'txt': '📄',
        'zip': '📦',
        'exe': '⚙️'
    };
    return icons[ext] || '📄';
}

// 파일 크기 포맷
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 브레드크럼 업데이트
function updateBreadcrumb(path) {
    const parts = path.split('/').filter(Boolean);
    let html = '<div class="breadcrumb">';
    html += `<button class="breadcrumb-item" onclick="loadFiles('')">root</button>`;

    let currentPath = '';
    parts.forEach((part, index) => {
        currentPath += (currentPath ? '/' : '') + part;
        html += `<span class="breadcrumb-separator">/</span>`;
        if (index === parts.length - 1) {
            html += `<span>${part}</span>`;
        } else {
            html += `<button class="breadcrumb-item" onclick="loadFiles('${currentPath}')">${part}</button>`;
        }
    });

    html += '</div>';
    elements.currentPath.innerHTML = html;
}

// 파일 다운로드
async function downloadFile(path, filename) {
    try {
        showToast('다운로드 준비 중...');

        const file = await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`);

        // Base64 디코딩
        const content = atob(file.content);
        const bytes = new Uint8Array(content.length);
        for (let i = 0; i < content.length; i++) {
            bytes[i] = content.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('다운로드 완료!', 'success');
    } catch (error) {
        showToast(`다운로드 실패: ${error.message}`, 'error');
    }
}

// 다운로드 URL 복사
async function copyDownloadUrl(path) {
    try {
        const file = await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`);
        await navigator.clipboard.writeText(file.download_url);
        showToast('URL이 복사되었습니다', 'success');
    } catch (error) {
        showToast(`복사 실패: ${error.message}`, 'error');
    }
}

// 릴리즈 목록 로드
async function loadReleases() {
    elements.releaseList.innerHTML = '<p class="loading">로딩 중...</p>';

    try {
        const releases = await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}/releases`);

        if (releases.length === 0) {
            elements.releaseList.innerHTML = '<p class="empty">릴리즈가 없습니다</p>';
            return;
        }

        elements.releaseList.innerHTML = releases.map(release => createReleaseItem(release)).join('');

    } catch (error) {
        elements.releaseList.innerHTML = `<p class="error">오류: ${error.message}</p>`;
    }
}

// 릴리즈 아이템 HTML 생성
function createReleaseItem(release) {
    const date = new Date(release.published_at).toLocaleDateString('ko-KR');
    const tagClass = release.prerelease ? 'release-tag prerelease' : 'release-tag';

    let assetsHtml = '';
    if (release.assets && release.assets.length > 0) {
        assetsHtml = `
            <div class="release-assets">
                ${release.assets.map(asset => `
                    <a href="${asset.browser_download_url}" class="asset-btn" download>
                        📦 ${asset.name} (${formatSize(asset.size)})
                    </a>
                `).join('')}
            </div>
        `;
    }

    // 소스 코드 다운로드 링크
    assetsHtml += `
        <div class="release-assets" style="margin-top: 0.5rem;">
            <a href="${release.zipball_url}" class="asset-btn">
                📥 Source (zip)
            </a>
            <a href="${release.tarball_url}" class="asset-btn">
                📥 Source (tar.gz)
            </a>
        </div>
    `;

    return `
        <div class="release-item">
            <div class="release-header">
                <span class="release-title">${release.name || release.tag_name}</span>
                <span class="${tagClass}">${release.tag_name}${release.prerelease ? ' (pre)' : ''}</span>
            </div>
            <div class="release-meta">
                ${release.author.login} · ${date}
            </div>
            ${release.body ? `<div class="release-body">${release.body}</div>` : ''}
            ${assetsHtml}
        </div>
    `;
}

// 모달 표시/숨기기
function showModal() {
    elements.releaseModal.classList.remove('hidden');
    elements.releaseForm.reset();
}

function hideModal() {
    elements.releaseModal.classList.add('hidden');
}

// 릴리즈 생성
async function handleCreateRelease(e) {
    e.preventDefault();

    const tag = document.getElementById('release-tag').value.trim();
    const name = document.getElementById('release-name').value.trim();
    const body = document.getElementById('release-body').value.trim();
    const prerelease = document.getElementById('release-prerelease').checked;

    if (!tag) {
        showToast('태그 이름을 입력해주세요', 'error');
        return;
    }

    try {
        showToast('릴리즈 생성 중...');

        await githubAPI(`/repos/${CONFIG.owner}/${CONFIG.repo}/releases`, {
            method: 'POST',
            body: JSON.stringify({
                tag_name: tag,
                name: name || tag,
                body: body,
                prerelease: prerelease
            })
        });

        hideModal();
        loadReleases();
        showToast('릴리즈가 생성되었습니다!', 'success');

    } catch (error) {
        showToast(`릴리즈 생성 실패: ${error.message}`, 'error');
    }
}

// 토스트 메시지
function showToast(message, type = '') {
    // 기존 토스트 제거
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// 전역 함수로 노출 (브레드크럼용)
window.loadFiles = loadFiles;
