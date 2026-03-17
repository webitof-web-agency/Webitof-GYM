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
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
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
