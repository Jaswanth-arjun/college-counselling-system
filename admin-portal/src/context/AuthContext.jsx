import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('admin-token'))
    const [loading, setLoading] = useState(true)

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token
            loadUser()
        } else {
            setLoading(false)
        }
    }, [token])

    const loadUser = async () => {
        try {
            // Admin specific user load
            const response = await axios.get('/api/admin/profile')
            setUser(response.data)
        } catch (error) {
            console.error('Error loading admin user:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                identifier: email,
                password,
                role: 'admin'
            })

            const { token: newToken, user: userData } = response.data

            localStorage.setItem('admin-token', newToken)
            setToken(newToken)
            axios.defaults.headers.common['x-auth-token'] = newToken
            setUser(userData)

            return { success: true, user: userData }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('admin-token')
        delete axios.defaults.headers.common['x-auth-token']
        setToken(null)
        setUser(null)
    }

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}