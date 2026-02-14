import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Accordion = ({ title, children, defaultOpen = false, className = '' }) => {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className={`bg-surface rounded-xl border border-gray-100 p-4 ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between mb-3 focus:outline-none"
                aria-expanded={open}
            >
                <div className="flex items-center">
                    <div className="w-2.5 h-6 bg-primary-500 rounded-r mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {children}
            </div>
        </div>
    )
}

export default Accordion
