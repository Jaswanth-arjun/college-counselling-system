import React from 'react'

const Tabs = ({ tabs = [], active = 0, onChange }) => {
    return (
        <div className="bg-white/5 rounded-xl p-1 flex space-x-1">
            {tabs.map((t, i) => (
                <button
                    key={t}
                    onClick={() => onChange(i)}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition ${i === active ? 'bg-primary-500 text-white' : 'text-gray-400'}`}
                    aria-pressed={i === active}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}

export default Tabs
