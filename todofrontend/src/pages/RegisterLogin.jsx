import React, { use, useEffect, useState } from 'react';
import { Check, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUserLoginMutation } from '../services/TodoApis';
import { useUserRegisterMutation } from '../services/TodoApis';
import { useNavigate } from 'react-router-dom';
const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState({});
  const [none_field_error, setNone_field_error] = useState({});
  const [userLogin] = useUserLoginMutation();
  const [userRegister] = useUserRegisterMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      const res = await userLogin({ username: formData.name, password: formData.password });
      console.log('Login Response:', res);
      if (res?.data?.token && res?.data?.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', formData.name);
        navigate('/todos');
      }
      else if (res?.error?.data?.status === 400 || res?.error?.data?.status === 401) {
        setLoginError(res.error?.data?.message)
        // console.log('Login Error:', res.error?.data?.message);
      }
    } else {
      const res = await userRegister({ username: formData.name, email: formData.email, password: formData.password, confirm_Password: formData.confirmPassword });
      // console.log('Register Response:', res);
      if (res.data?.token && res?.data?.status === 201) {
        localStorage.setItem('token', res.data.token);
        alert('Registration successful!');
        navigate('/todos');

      }
      if (res.error?.data) {
        setRegisterError(res?.error?.data)
      }
      if (res.error?.data?.non_field_errors) {
        setNone_field_error(res?.error?.data?.non_field_errors)
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Form Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
            <p className="text-white/70">Stay organized and achieve your goals</p>
          </div>

          {/* Form Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${isLogin
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${!isLogin
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="username"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                required
              />
              {registerError.username && (<div className='flex gap-2 items-center '>
                <AlertCircle color='red' size={18} />
                <p className="text-red-600 text-sm">{registerError.username[0]}</p>
              </div>
              )}

            </div>

            {/* Email Field */}
            {!isLogin &&
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            }

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

            </div>
            {registerError.password && (<div className='flex gap-2 items-center'>
              <AlertCircle color='red' size={18} />
              <p className="text-red-600 text-sm">{registerError.password[0]}</p>
            </div>

            )}

            {/* error fields */}
            {isLogin && loginError.length > 0 ? <div className='flex gap-2 items-center'>
              <AlertCircle color='red' size={18} />
              <p className="text-red-600 text-sm">{loginError}</p>
            </div> : ''
            }

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

            )
            }
            {registerError.confirm_password && (<div className='flex gap-2 items-center'>
              <AlertCircle color='red' size={18} />
              <p className="text-red-600 text-sm">{registerError.confirm_password[0]}</p>
            </div>
            )}
            {none_field_error && none_field_error.length > 0 ? <div className='flex gap-2 items-center'>
              <AlertCircle color='red' size={18} />
              <p className="text-red-600 text-sm">{none_field_error}</p>
            </div> : ''
            }

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Social Login */}
          {/* <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all duration-300 group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>
              <button className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all duration-300 group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
            </div>
          </div> */}

          {/* Terms & Privacy (Register only) */}
          {!isLogin && (
            <div className="mt-6 text-center">
              <p className="text-xs text-white/60">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-white hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-white hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}
        </div>

        {/* Switch Form Link */}
        <div className="text-center mt-6">
          <p className="text-white/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleForm}
              className="text-white font-medium hover:underline transition-all"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div >
  )
}

export default AuthForms;