import {Link} from 'react-router-dom'
import "../css/NavBar.css"

function NavBar () {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie app</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  )
}

export default NavBar