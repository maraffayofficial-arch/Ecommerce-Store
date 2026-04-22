import './App.css'
import Home from './pages/Home'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import Products from './pages/Products'
import Signup from './components/Signup'
import Contact from './pages/Contact'
import HomeAdmin from './adminFrontend/HomeAdmin'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import { Toaster } from "react-hot-toast"
import { useAuth } from './context/AuthProvider'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [authUser] = useAuth()
  if (!authUser) return <Navigate to="/" />
  if (adminOnly && authUser.role !== 'admin') return <Navigate to="/" />
  return children
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path='/change-password' element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/admin' element={<ProtectedRoute adminOnly><HomeAdmin /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
