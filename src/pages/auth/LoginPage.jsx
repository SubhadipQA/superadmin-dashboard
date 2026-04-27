import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParkingCircle, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
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
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1565C0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00BCD4]/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1565C0] flex items-center justify-center mb-4 shadow-lg shadow-[#1565C0]/30">
            <ParkingCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl">YPark</h1>
          <p className="text-[#506A84] text-sm mt-1">Super Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#132236] rounded-2xl border border-[#1A3048] p-8 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-white font-bold text-lg">Welcome back</h2>
            <p className="text-[#506A84] text-sm mt-1">
              Sign in to access your admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
                <p className="text-[#C0392B] text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[#8BA8C8] text-xs font-semibold uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#506A84]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ypark.in"
                  className="w-full bg-[#0D1B2A] border border-[#1A3048] rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder:text-[#506A84] focus:outline-none focus:border-[#1565C0] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[#8BA8C8] text-xs font-semibold uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#506A84]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#0D1B2A] border border-[#1A3048] rounded-lg pl-10 pr-11 py-3 text-white text-sm placeholder:text-[#506A84] focus:outline-none focus:border-[#1565C0] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#506A84] hover:text-[#8BA8C8] transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1565C0] hover:bg-[#0D47A1] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Hint */}
          <div className="mt-6 pt-6 border-t border-[#1A3048]">
            <p className="text-[#506A84] text-xs text-center">
              This panel is restricted to authorized personnel only.
            </p>
          </div>

        </div>

        {/* Version */}
        <p className="text-center text-[#506A84] text-xs mt-6">
          YPark Admin v1.0 · Phase 1
        </p>

      </div>
    </div>
  )
}

export default LoginPage