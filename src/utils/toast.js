import { useState, useEffect, useCallback } from 'react'

// Toast Notification System
let toastListeners = []
let toastId = 0

export const toast = {
    success: (msg) => emit({ id: ++toastId, type: 'success', msg }),
    error: (msg) => emit({ id: ++toastId, type: 'error', msg }),
    info: (msg) => emit({ id: ++toastId, type: 'info', msg }),
    warning: (msg) => emit({ id: ++toastId, type: 'warning', msg }),
}

function emit(t) {
    toastListeners.forEach((cb) => cb(t))
}

export function useToasts() {
    const [toasts, setToasts] = useState([])
    useEffect(() => {
        const handler = (t) => {
            setToasts((prev) => [...prev, t])
            setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4000)
        }
        toastListeners.push(handler)
        return () => { toastListeners = toastListeners.filter((x) => x !== handler) }
    }, [])
    const remove = useCallback((id) => setToasts((prev) => prev.filter((x) => x.id !== id)), [])
    return { toasts, remove }
}
