"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "./notify";

export const useFetch = (func, query = {}, load = true) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(load)
    const [error, setError] = useState('')
    const [params, setParams] = useState(query)
    const paramsRef = useRef(query);
    const mountedRef = useRef(true);

    const getData = useCallback((query = {}) => {
        const nextParams = { ...paramsRef.current, ...query };
        paramsRef.current = nextParams;
        setParams(nextParams)
        setLoading(true)
        setError('')
        return func(nextParams).then(({ error, data, msg }) => {
            if (!mountedRef.current) {
                return;
            }
            setLoading(false)
            if (error === false) {
                setData(data)
            } else {
                setData(undefined)
                setError(msg)
            }
        }).catch(e => {
            if (mountedRef.current) {
                setLoading(false)
                setError(e?.message || 'Something went wrong')
            }
        })
    }, [func, load]);

    useEffect(() => {
        mountedRef.current = true;
        if (load) {
            getData(paramsRef.current)
        }
        return () => {
            mountedRef.current = false;
        };
    }, [getData, load]);

    const clear = () => setData(undefined)
    return [data, getData, { query: params, loading, error, clear }];
}

export const useAction = async (func, data, reload, alert = true, successMsg) => {
    const { error, msg, data: d } = await func({ ...data })
    if (error === false) {
        if (reload) {
            reload(d)
        }
        if (alert) {
            notifySuccess(successMsg || msg || 'Success')
        }
    } else {
        notifyError(msg || 'Something went wrong')
    }
}

export const useActionConfirm = async (func, data, reload, message, mode, alert = true) => {
    const { isConfirmed } = await Swal.fire({
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:8px 0">
                <div style="width:52px;height:52px;border-radius:14px;background:rgba(239,68,68,0.08);display:flex;align-items:center;justify-content:center;margin-bottom:4px">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <div style="font-size:15px;font-weight:800;color:#1e293b;letter-spacing:-0.3px;line-height:1.3">Confirm Action</div>
                <div style="font-size:12.5px;color:#64748b;font-weight:500;text-align:center;line-height:1.6;max-width:260px">${message || 'This action cannot be undone. Are you sure you want to continue?'}</div>
            </div>
        `,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes, Proceed',
        cancelButtonText: 'Cancel',
        buttonsStyling: false,
        focusConfirm: false,
        padding: '28px',
        width: '380px',
        background: '#ffffff',
        customClass: {
            popup: 'swal2-modern-popup',
            actions: 'swal2-modern-actions',
        },
        didOpen: (popup) => {
            // Style popup
            popup.style.borderRadius = '16px';
            popup.style.boxShadow = '0 20px 60px -12px rgba(0,0,0,0.18)';
            popup.style.border = '1px solid rgba(226,232,240,0.8)';
            popup.style.fontFamily = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

            // Style actions container
            const actions = popup.querySelector('.swal2-actions');
            if (actions) {
                actions.style.gap = '10px';
                actions.style.marginTop = '8px';
                actions.style.display = 'flex';
                actions.style.justifyContent = 'center';
            }

            // Style confirm button
            const confirmBtn = popup.querySelector('.swal2-confirm');
            if (confirmBtn) {
                confirmBtn.style.cssText = `
                    background: #5572fc !important;
                    color: #ffffff !important;
                    border: none !important;
                    border-radius: 10px !important;
                    font-size: 12.5px !important;
                    font-weight: 700 !important;
                    padding: 9px 22px !important;
                    letter-spacing: 0.2px !important;
                    box-shadow: 0 4px 14px -2px rgba(85,114,252,0.4) !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    outline: none !important;
                `;
                confirmBtn.onmouseenter = () => {
                    confirmBtn.style.background = '#4461eb';
                    confirmBtn.style.transform = 'translateY(-1px)';
                };
                confirmBtn.onmouseleave = () => {
                    confirmBtn.style.background = '#5572fc';
                    confirmBtn.style.transform = 'translateY(0)';
                };
            }

            // Style cancel button
            const cancelBtn = popup.querySelector('.swal2-cancel');
            if (cancelBtn) {
                cancelBtn.style.cssText = `
                    background: #ffffff !important;
                    color: #64748b !important;
                    border: 1.5px solid #e2e8f0 !important;
                    border-radius: 10px !important;
                    font-size: 12.5px !important;
                    font-weight: 700 !important;
                    padding: 9px 22px !important;
                    letter-spacing: 0.2px !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    outline: none !important;
                `;
                cancelBtn.onmouseenter = () => {
                    cancelBtn.style.background = '#f8fafc';
                    cancelBtn.style.borderColor = '#cbd5e1';
                    cancelBtn.style.color = '#334155';
                };
                cancelBtn.onmouseleave = () => {
                    cancelBtn.style.background = '#ffffff';
                    cancelBtn.style.borderColor = '#e2e8f0';
                    cancelBtn.style.color = '#64748b';
                };
            }

            // Style backdrop
            const backdrop = document.querySelector('.swal2-backdrop-show');
            if (backdrop) {
                backdrop.style.background = 'rgba(15, 23, 42, 0.45)';
                backdrop.style.backdropFilter = 'blur(4px)';
            }
        }
    })
    if (isConfirmed) {
        await useAction(func, data, reload, alert)
    }
}




export const userOutSideClick = (ref, func) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func && func()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
