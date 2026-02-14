import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 transition-transform duration-200'
    const variants = {
        primary: 'bg-primary-500 text-white hover:scale-[0.997] focus:outline-none',
        secondary: 'border-2 border-secondary-500 text-secondary-500 bg-white/5 hover:bg-secondary-50',
        ghost: 'bg-transparent text-gray-700'
    }

    return (
        <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
