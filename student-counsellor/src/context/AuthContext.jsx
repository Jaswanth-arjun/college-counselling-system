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
            const userData = {
                id: tokenData.id,
                role: tokenData.role,
                roll_no: tokenData.roll_no,
                email: tokenData.email
            }

            // Fetch additional info based on role
            if (tokenData.role === 'counsellor') {
                try {
                    const response = await axios.get('/api/counsellor/profile')
                    const profileData = response.data || {}
                    userData.name = profileData.name
                    userData.counsellorInfo = profileData
                } catch (error) {
                    console.warn('Could not fetch counsellor info:', error)
                }
            } else if (tokenData.role === 'student') {
                try {
                    const response = await axios.get('/api/student/profile')
                    const profileData = response.data || {}
                    userData.name = profileData.users?.name
                    userData.studentInfo = profileData
                } catch (error) {
                    console.warn('Could not fetch student info:', error)
                }
            }

            setUser(userData)
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