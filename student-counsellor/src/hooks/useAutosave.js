import { useEffect, useRef, useState } from 'react'

export default function useAutosave(value, saveFn, delay = 1000) {
    const timer = useRef(null)
    const prev = useRef(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        // shallow compare to avoid unnecessary saves
        const changed = JSON.stringify(prev.current) !== JSON.stringify(value)
        if (!changed) return

        prev.current = value

        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(async () => {
            try {
                setSaving(true)
                await saveFn(value)
            } catch (err) {
                // swallow errors; caller can handle via saveFn
                console.error('Autosave error:', err)
            } finally {
                setSaving(false)
            }
        }, delay)

        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [value, saveFn, delay])

    return saving
}
