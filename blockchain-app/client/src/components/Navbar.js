import React from 'react'

export const Navbar = () => {
  return (
    <nav>
      <div className='logo'>
        <h2>blockchain</h2>
      </div>
      <ul className="navilinks">
        <li>market</li>
        <li>exchange</li>
      </ul>
      <button>login</button>
    </nav>
  )
}

export default Navbar;