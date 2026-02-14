import React from 'react'

const Stepper = ({ steps = [], current = 0 }) => {
    return (
        <div className="flex items-center space-x-4">
            {steps.map((s, i) => (
                <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= current ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-300'}`}>
                        {i + 1}
                    </div>
                    <div className="ml-3 hidden md:block">
                        <div className={`text-sm ${i <= current ? 'text-gray-900' : 'text-gray-500'}`}>{s}</div>
                    </div>
                    {i < steps.length - 1 && <div className={`w-12 h-0.5 ml-4 ${i < current ? 'bg-primary-500' : 'bg-white/10'}`}></div>}
                </div>
            ))}
        </div>
    )
}

export default Stepper
