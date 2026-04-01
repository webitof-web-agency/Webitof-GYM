import Swal from 'sweetalert2';

// ─── Shared inline styles ──────────────────────────────────────────
const POPUP_STYLE = `
    border-radius: 20px !important;
    box-shadow: 0 24px 64px -12px rgba(0,0,0,0.16), 0 0 0 1px rgba(226,232,240,0.7) !important;
    font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    padding: 0 !important;
    overflow: hidden !important;
`;

const BTN_CONFIRM = `
    background: #5572fc !important;
    color: #fff !important;
    border: none !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    padding: 10px 24px !important;
    box-shadow: 0 4px 14px -2px rgba(85,114,252,0.35) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    letter-spacing: 0.1px !important;
`;

const BTN_CANCEL = `
    background: #fff !important;
    color: #64748b !important;
    border: 1.5px solid #e2e8f0 !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    padding: 10px 24px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    letter-spacing: 0.1px !important;
`;

const BTN_DANGER = `
    background: #ef4444 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    padding: 10px 24px !important;
    box-shadow: 0 4px 14px -2px rgba(239,68,68,0.3) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    letter-spacing: 0.1px !important;
`;

// ─── Icon SVGs ─────────────────────────────────────────────────────
const ICONS = {
    question: {
        bg: 'rgba(85,114,252,0.08)',
        border: 'rgba(85,114,252,0.2)',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5572fc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`,
    },
    warning: {
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`,
    },
    error: {
        bg: 'rgba(239,68,68,0.08)',
        border: 'rgba(239,68,68,0.2)',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>`,
    },
    success: {
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.2)',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
    },
};

// ─── didOpen helper: styles popup + buttons ─────────────────────────
function applyStyles(popup, { confirmDanger = false } = {}) {
    // Popup shape
    popup.style.cssText += POPUP_STYLE;
    popup.style.fontFamily = "'Poppins', 'Inter', -apple-system, sans-serif";

    // Actions row
    const actions = popup.querySelector('.swal2-actions');
    if (actions) {
        actions.style.cssText = 'gap:10px;margin:0;padding:0 28px 28px;display:flex;justify-content:center;';
    }

    // Confirm button
    const confirmBtn = popup.querySelector('.swal2-confirm');
    if (confirmBtn) {
        confirmBtn.style.cssText = confirmDanger ? BTN_DANGER : BTN_CONFIRM;
        confirmBtn.onmouseenter = () => confirmBtn.style.transform = 'translateY(-1px)';
        confirmBtn.onmouseleave = () => confirmBtn.style.transform = 'translateY(0)';
    }

    // Cancel button
    const cancelBtn = popup.querySelector('.swal2-cancel');
    if (cancelBtn) {
        cancelBtn.style.cssText = BTN_CANCEL;
        cancelBtn.onmouseenter = () => { cancelBtn.style.background = '#f8fafc'; cancelBtn.style.color = '#334155'; };
        cancelBtn.onmouseleave = () => { cancelBtn.style.background = '#fff'; cancelBtn.style.color = '#64748b'; };
    }

    // Backdrop blur
    const backdrop = document.querySelector('.swal2-backdrop-show');
    if (backdrop) {
        backdrop.style.background = 'rgba(15,23,42,0.5)';
        backdrop.style.backdropFilter = 'blur(6px)';
    }
}

// ─── Build HTML body ────────────────────────────────────────────────
function buildHtml({ icon = 'question', title, text }) {
    const ic = ICONS[icon] || ICONS.question;
    return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:32px 28px 20px">
            <div style="width:56px;height:56px;border-radius:16px;background:${ic.bg};border:1.5px solid ${ic.border};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${ic.svg}
            </div>
            <div style="font-size:16px;font-weight:800;color:#1e293b;letter-spacing:-0.4px;line-height:1.3;text-align:center">${title}</div>
            ${text ? `<div style="font-size:12.5px;color:#64748b;font-weight:500;text-align:center;line-height:1.65;max-width:280px">${text}</div>` : ''}
        </div>
    `;
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Confirmation dialog (blue confirm button)
 * Returns: Promise<SweetAlertResult>
 */
export const swalConfirm = ({
    icon = 'question',
    title = 'Are you sure?',
    text = '',
    confirmText = 'Yes, Proceed',
    cancelText = 'Cancel',
} = {}) => Swal.fire({
    html: buildHtml({ icon, title, text }),
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    focusConfirm: false,
    width: '400px',
    background: '#ffffff',
    didOpen: (popup) => applyStyles(popup, { confirmDanger: false }),
});

/**
 * Danger / delete confirmation dialog (red confirm button)
 */
export const swalDanger = ({
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    confirmText = 'Yes, Delete',
    cancelText = 'Cancel',
} = {}) => Swal.fire({
    html: buildHtml({ icon: 'warning', title, text }),
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    focusConfirm: false,
    width: '400px',
    background: '#ffffff',
    didOpen: (popup) => applyStyles(popup, { confirmDanger: true }),
});

/**
 * Alert dialogs (no cancel button)
 */
export const swalAlert = ({
    icon = 'success',
    title = '',
    text = '',
    confirmText = 'OK',
} = {}) => Swal.fire({
    html: buildHtml({ icon, title, text }),
    showCancelButton: false,
    confirmButtonText: confirmText,
    buttonsStyling: false,
    focusConfirm: false,
    width: '400px',
    background: '#ffffff',
    didOpen: (popup) => applyStyles(popup, { confirmDanger: icon === 'error' }),
});
