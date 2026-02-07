import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
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
            const tokenData = JSON.parse(atob(token.split('.')[1]))
            setUser({
                id: tokenData.id,
                role: tokenData.role,
                roll_no: tokenData.roll_no,
                email: tokenData.email
            })
        } catch (error) {
            console.error('Error loading user:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password, role) => {
        try {
            const response = await axios.post('/api/auth/login', {
                identifier,
                password,
                role
            })

            const { token: newToken, user: userData } = response.data

            localStorage.setItem('token', newToken)
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

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register/student', userData)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['x-auth-token']
        setToken(null)
        setUser(null)
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}