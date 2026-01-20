// Face reading enable/disable functions

function disableFaceReading() {
    const faceSection = document.querySelector('.face-reading-section');
    if (!faceSection) return;

    faceSection.classList.add('disabled');

    // Check if overlay already exists
    if (faceSection.querySelector('.disabled-overlay')) return;

    // Add disabled overlay
    const overlay = document.createElement('div');
    overlay.className = 'disabled-overlay';
    overlay.innerHTML = `
        <div class="disabled-message">
            <p>🔒 사주팔자 분석을 먼저 완료해주세요</p>
            <small>생년월일과 시간을 입력하고 행운의 번호를 생성하세요</small>
        </div>
    `;
    faceSection.appendChild(overlay);
}

function enableFaceReading() {
    const faceSection = document.querySelector('.face-reading-section');
    if (!faceSection) return;

    faceSection.classList.remove('disabled');

    // Remove overlay
    const overlay = faceSection.querySelector('.disabled-overlay');
    if (overlay) {
        overlay.remove();
    }

    // Show activation notice
    const notice = document.createElement('div');
    notice.className = 'activation-notice';
    notice.innerHTML = '✨ 사주 분석이 완료되었습니다. 이제 관상 매칭이 가능합니다!';

    // Insert after section title
    const sectionTitle = faceSection.querySelector('.section-title');
    if (sectionTitle && sectionTitle.nextSibling) {
        faceSection.insertBefore(notice, sectionTitle.nextSibling);
    } else {
        faceSection.insertBefore(notice, faceSection.children[1]);
    }

    // Remove notice after 4 seconds
    setTimeout(() => {
        notice.style.opacity = '0';
        setTimeout(() => notice.remove(), 300);
    }, 4000);
}
