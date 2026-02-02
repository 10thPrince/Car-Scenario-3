import { LogOut, Menu } from 'lucide-react'
import React from 'react'


const Navbar = () => {
  

return (

  <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold">Car Manager</span>
    </div>


    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-6">
        <a
          href="/car"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
        >
          Car
        </a>
        <a
          href="/car"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
        >
          Car
        </a>
    </div>


    {/* Actions */}
    <div className="hidden md:flex">
      <button className="flex gap-2 text-white px-6 py-2 rounded items-center font-semibold bg-black">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>


    {/* Mobile */}
    <button onClick={() => setOpen(!open)} className="md:hidden">
      <Menu />
    </button>


    {open && (
      <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 md:hidden">
        
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium"
          >
            Car
          </a>
        
        <button  className="flex gap-2 text-red px-6 py-3 bg-black">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    )}
  </nav>
)
}

export default Navbar