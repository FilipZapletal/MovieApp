import {Link} from 'react-router-dom'

function NavBar () {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie app</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <br/>
        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  )
}

export default NavBar