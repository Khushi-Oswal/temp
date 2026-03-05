import { createContext, useContext, useState, useEffect } from 'react'
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'

// ⚠️ REPLACE THESE with your actual Cognito values from AWS Console
const POOL_DATA = {
  UserPoolId: ap-south-1_3aPW8eaey
  ClientId: 70d7blck8mc1uemlif918872rh
}

const userPool = new CognitoUserPool(POOL_DATA)

// ─── Auth Functions ───────────────────────────────────────

export function signUp(email, password, name) {
  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ]
    userPool.signUp(email, password, attributes, null, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool })
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool })
    const authDetails = new AuthenticationDetails({ Username: email, Password: password })
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    })
  })
}

export function signOut() {
  const user = userPool.getCurrentUser()
  if (user) user.signOut()
}

export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser()
    if (!user) return resolve(null)
    user.getSession((err, session) => {
      if (err || !session?.isValid()) return resolve(null)
      user.getUserAttributes((err2, attrs) => {
        if (err2) return resolve(null)
        const profile = {}
        attrs.forEach((a) => (profile[a.getName()] = a.getValue()))
        resolve({
          email: profile.email,
          name: profile.name || profile.email?.split('@')[0],
          token: session.getIdToken().getJwtToken(),
          sub: profile.sub,
        })
      })
    })
  })
}

export function getIdToken() {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser()
    if (!user) return resolve(null)
    user.getSession((err, session) => {
      if (err || !session?.isValid()) return resolve(null)
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

export function resendConfirmationCode(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool })
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

// ─── React Auth Context ───────────────────────────────────

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    await signIn(email, password)
    const u = await getCurrentUser()
    setUser(u)
    return u
  }

  const register = async (email, password, name) => {
    const result = await signUp(email, password, name)
    return result
  }

  const confirm = async (email, code) => {
    await confirmSignUp(email, code)
  }

  const logout = () => {
    signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, confirm, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
