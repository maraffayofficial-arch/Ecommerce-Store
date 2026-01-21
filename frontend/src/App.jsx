
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Products from './pages/Products'
import Signup from './components/Signup'
import Contact from './pages/Contact'
function App() {
  
  return (
    <>
    {/* <div className='dark:bg-slate-900 dark:text-white'> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/products' element={<Products/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route/>
    </Routes>
    </BrowserRouter>

    {/* </div> */}
    
    </>
  )
}

export default App
