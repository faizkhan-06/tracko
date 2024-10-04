import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Use isAuthenticated state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to the home page after logout
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  return (
    <header className="bg-black-100 text-white-100">
      <nav className="max-w-7xl mx-auto py-3 px-6 flex items-center justify-between">
        <h1 className="font-smooch text-3xl md:text-4xl">tracko</h1>

        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <h1 className="text-lg md:text-xl">
              {user?.displayName || "User"}
            </h1>

            <AiOutlineLogout
              onClick={handleLogout}
              className="text-xl cursor-pointer hover:text-red-600 transition duration-300 ease-in-out"
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
