import { Link } from "react-router-dom"

const Header = () => {
  return (
    <>

    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-pink-500 text-lg font-bold">
          <Link to="/" >E-Commerce</Link>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-pink-500 hover:text-gray-300">Login</Link>
          <Link to="/register" className="text-pink-500 hover:text-gray-300">Register</Link>
        </div>
      </div>

    </nav>
    </>
  )
}

export default Header