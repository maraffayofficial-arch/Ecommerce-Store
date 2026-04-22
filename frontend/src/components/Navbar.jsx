import React, { useEffect, useRef, useState } from 'react'
import Login from './Login'
import { useAuth } from '../context/AuthProvider'
import { useCart } from '../context/CartProvider'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaSearch, FaUserCircle, FaBoxOpen, FaLock, FaSignInAlt, FaSignOutAlt, FaUserCog } from 'react-icons/fa'
import { useSettings } from '../context/SettingsProvider'
import toast from 'react-hot-toast'

const categories = [
  { label: 'All Products', value: '' },
  { label: 'Achar / Pickle', value: 'achar' },
  { label: 'Chatni', value: 'chatni' },
  { label: 'Sauces', value: 'sauce' },
  { label: 'Sweet', value: 'sweet' },
  { label: 'Spices', value: 'spices' },
]

const Navbar = () => {
  const [authUser, setAuthUser] = useAuth()
  const { cartCount } = useCart()
  const { saleBanner } = useSettings()
  const navigate = useNavigate()
  const profileRef = useRef(null)

  const stripBgMap = {
    green: 'bg-green-600', orange: 'bg-orange-500', red: 'bg-red-600',
    purple: 'bg-purple-600', blue: 'bg-blue-600', gold: 'bg-yellow-400 text-yellow-900',
  }

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  const [searchQuery, setSearchQuery] = useState('')
  const [sticky, setSticky] = useState(false)
  const [hasNewOrder, setHasNewOrder] = useState(!!localStorage.getItem("hasNewOrder"))
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setHasNewOrder(!!localStorage.getItem("hasNewOrder"))
    window.addEventListener("orderNotifUpdate", handler)
    return () => window.removeEventListener("orderNotifUpdate", handler)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      root.setAttribute('data-theme', 'light')
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleCategoryClick = (value) => {
    if (value) navigate(`/products?category=${value}`)
    else navigate('/products')
  }

  const handleLogout = () => {
    setProfileOpen(false)
    setAuthUser({ ...authUser, user: null })
    toast.success("Logged out")
    setTimeout(() => {
      localStorage.removeItem("user")
      window.location.reload()
    }, 1500)
  }

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const bannerActive = saleBanner?.enabled && saleBanner?.title

  return (
    <>
    {bannerActive && (
      <div className={`fixed top-0 left-0 right-0 z-[60] h-8 overflow-hidden flex items-center text-white text-xs sm:text-sm font-semibold ${stripBgMap[saleBanner.bgColor] || 'bg-green-600'}`}>
        <span className='animate-marquee'>
          {saleBanner.title}
          {saleBanner.subtitle ? ` — ${saleBanner.subtitle}` : ''}
          &nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
          {saleBanner.title}
          {saleBanner.subtitle ? ` — ${saleBanner.subtitle}` : ''}
          &nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    )}
    <div className={`z-50 navbar fixed left-0 right-0 px-2 shadow-sm transition-all duration-300
      ${bannerActive ? 'top-8' : 'top-0'}
      ${sticky ? 'bg-base-200 shadow-md' : 'bg-base-100'}`}>

      {/* LEFT */}
      <div className="navbar-start flex items-center gap-1 min-w-0">
        {/* Mobile hamburger */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 gap-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li>
              <details>
                <summary className="font-semibold">Categories</summary>
                <ul className="ml-2">
                  {categories.map(c => (
                    <li key={c.value}>
                      <button onClick={() => handleCategoryClick(c.value)} className="text-left w-full">{c.label}</button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className="mt-2">
              <div className="flex items-center border border-gray-300 rounded-lg px-2">
                <input type="text" placeholder="Search pickles..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearch}
                  className="bg-transparent outline-none py-1 w-full text-sm" />
                <FaSearch className="text-gray-400" />
              </div>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="text-green-700 font-bold text-xl ml-1 lg:ml-8 shrink-0">
          Urban <span className="text-orange-500">Pickle</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex menu menu-horizontal px-0 gap-0 items-center text-sm ml-4 xl:ml-16">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/products', label: 'Products' },
            { to: '/about', label: 'About Us' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end}
                className={({ isActive }) =>
                  isActive ? 'text-orange-500 font-semibold border-b-2 border-orange-500 rounded-none' : ''
                }>
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <details>
              <summary className="font-medium">Categories</summary>
              <ul className="bg-base-100 shadow-lg rounded-box w-48 p-2 z-50">
                {categories.map(c => (
                  <li key={c.value}>
                    <button onClick={() => handleCategoryClick(c.value)} className="text-left w-full rounded-lg px-3 py-2 hover:bg-base-200">
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          {authUser?.role === 'admin' && (
            <li>
              <NavLink to="/admin"
                className={({ isActive }) =>
                  isActive ? 'text-orange-500 font-semibold border-b-2 border-orange-500 rounded-none' : 'text-orange-600 font-semibold'
                }>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end flex gap-4 lg:gap-6 items-center pl-1 pr-2 sm:pr-4 lg:pr-16 shrink-0">
        {/* Desktop Search */}
        <div className="hidden lg:flex items-center border border-gray-300 rounded-full px-3 py-1.5 bg-base-100 gap-2">
          <input type="text" placeholder="Search..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearch}
            className="bg-transparent outline-none text-sm w-28 focus:w-40 transition-all duration-300" />
          <button onClick={() => { if (searchQuery.trim()) { navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery('') } }}>
            <FaSearch className="text-gray-400 hover:text-green-700 cursor-pointer" />
          </button>
        </div>

        {/* Theme Toggle */}
        <label className="swap swap-rotate cursor-pointer">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <svg className="swap-off h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg className="swap-on h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        {/* Cart */}
        <NavLink to="/cart" className={({ isActive }) => `relative cursor-pointer hover:text-orange-500 transition-colors ${isActive ? 'text-orange-500' : ''}`}>
          <FaShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </NavLink>

        {/* Login dialog always in DOM */}
        {!authUser && <Login noTrigger />}

        {/* Login / Logout button */}
        <div className="hidden sm:flex">
          {authUser ? (
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-red-500 text-white border-none hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              className="btn btn-sm bg-black text-white border-none hover:bg-gray-800"
              onClick={() => document.getElementById('my_modal_3').showModal()}
            >
              Login
            </button>
          )}
        </div>

        {/* Profile Icon + Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-50 transition-colors group/profile cursor-pointer"
            aria-label="Profile menu"
          >
            <FaUserCircle className="h-7 w-7 text-gray-600 group-hover/profile:text-orange-500 transition-colors" />
            {/* Red dot if new order */}
            {hasNewOrder && authUser && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-base-100" />
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-base-100 shadow-2xl rounded-2xl overflow-hidden z-[70] border border-base-200">

              {/* User info header */}
              {authUser ? (
                <div className="px-4 py-3 bg-green-700 text-white">
                  <p className="font-bold text-sm truncate">{authUser.name}</p>
                  <p className="text-xs opacity-80 truncate">{authUser.email}</p>
                </div>
              ) : (
                <div className="px-4 py-3 bg-gray-800 text-white">
                  <p className="font-semibold text-sm">Welcome!</p>
                  <p className="text-xs opacity-70">Sign in to your account</p>
                </div>
              )}

              <div className="p-2 flex flex-col gap-0.5">
                {authUser && (
                  <>
                    {/* My Orders */}
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium"
                    >
                      <FaBoxOpen className="text-green-700 shrink-0" />
                      <span>My Orders</span>
                      {hasNewOrder && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </Link>

                    {/* Change Password */}
                    <Link
                      to="/change-password"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium"
                    >
                      <FaLock className="text-green-700 shrink-0" />
                      <span>Change Password</span>
                    </Link>

                    {/* Admin Panel */}
                    {authUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium text-orange-600"
                      >
                        <FaUserCog className="shrink-0" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </>
                )}

                <div className="border-t border-base-200 mt-1 pt-1">
                  {authUser ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm font-medium w-full text-left"
                    >
                      <FaSignOutAlt className="shrink-0" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileOpen(false); document.getElementById('my_modal_3').showModal() }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium w-full text-left"
                    >
                      <FaSignInAlt className="text-green-700 shrink-0" />
                      <span>Login / Register</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar
