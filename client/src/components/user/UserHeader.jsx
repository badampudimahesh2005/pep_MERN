// components/UserHeader.jsx
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

function UserHeader() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-lg font-bold text-white hover:text-gray-200">
          Dashboard
        </Link>
        <UserDropdown />
      </div>
    </nav>
  );
}

export default UserHeader;
