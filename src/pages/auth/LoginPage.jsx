import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import useAuthStore from '@/store/authStore'

// ─── Mock credentials ──────────────────────────────────────
// When API ready replace this with:
// POST /api/admin/auth/login
// { email, password } → { admin, token }
const MOCK_ADMIN = {
  email: 'admin@ypark.in',
  password: 'admin123',
  data: {
    id: 1,
    name: 'Super Admin',
    email: 'admin@ypark.in',
    role: 'SUPER_ADMIN',
  },
  token: 'mock-jwt-token-ypark-admin',
}

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock validation
    // When API ready → replace with axios.post('/api/admin/auth/login', { email, password })
    if (
      email === MOCK_ADMIN.email &&
      password === MOCK_ADMIN.password
    ) {
      login(MOCK_ADMIN.data, MOCK_ADMIN.token)
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ypark-black relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-ypark-deep-blue/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-ypark-bright-blue/20 rounded-full blur-[120px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <img 
              src="/ypark-admin-white.svg" 
              alt="YPark Admin" 
              className="h-10"
            />
          </div>
          
          {/* Center Content */}
          <div className="space-y-6">
            <h1 className="text-white text-5xl font-bold leading-tight">
              Manage Your<br />
              <span className="text-ypark-bright-blue">Parking Empire</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              Complete control over vendors, zones, settlements, and analytics — all in one powerful dashboard.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-ypark-bright-blue text-3xl font-bold">500+</p>
                <p className="text-white/40 text-sm">Parking Zones</p>
              </div>
              <div>
                <p className="text-ypark-bright-blue text-3xl font-bold">₹2Cr+</p>
                <p className="text-white/40 text-sm">Monthly Revenue</p>
              </div>
              <div>
                <p className="text-ypark-bright-blue text-3xl font-bold">50K+</p>
                <p className="text-white/40 text-sm">Daily Users</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-white/30 text-sm">
            © 2026 YPark. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-ypark-light-gray flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img 
              src="/ypark-admin-black.svg" 
              alt="YPark Admin" 
              className="h-8"
            />
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-ypark-black text-3xl font-bold">Welcome back</h2>
            <p className="text-ypark-black/50 mt-2">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-ypark-black text-sm font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ypark-black/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ypark.in"
                    className="w-full bg-ypark-light-gray border-0 rounded-xl pl-12 pr-4 py-3.5 text-ypark-black text-sm placeholder:text-ypark-black/30 focus:outline-none focus:ring-2 focus:ring-ypark-deep-blue transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-ypark-black text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ypark-black/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-ypark-light-gray border-0 rounded-xl pl-12 pr-12 py-3.5 text-ypark-black text-sm placeholder:text-ypark-black/30 focus:outline-none focus:ring-2 focus:ring-ypark-deep-blue transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ypark-black/30 hover:text-ypark-black/60 transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="w-5 h-5" />
                      : <Eye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ypark-deep-blue hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-ypark-deep-blue/25"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Hint */}
          <p className="text-ypark-black/40 text-sm text-center mt-6">
            This panel is restricted to authorized personnel only.
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage