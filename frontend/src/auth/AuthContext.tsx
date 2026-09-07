import { createContext, useContext, useState, type ReactNode } from 'react'
import { apiClient, AUTH_STORAGE_KEY } from '../api/client'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser())

  async function login(email: string, password: string): Promise<AuthUser> {
    const { data } = await apiClient.post('/api/auth/login', { email, password })
    const authUser: AuthUser = {
      token: data.token,
      employeeId: data.employeeId,
      fullName: data.fullName,
      role: data.role,
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    return authUser
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}
