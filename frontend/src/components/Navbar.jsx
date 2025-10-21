import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoReorderThreeOutline } from "react-icons/io5";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setRole(Number(parsedUser.role));
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        isActive
            ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
            : "text-gray-700 hover:text-indigo-600 transition-colors";

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Mini-App</h1>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <li>
                        <NavLink to="/" className={linkClass}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ask-questions" className={linkClass}>
                            Ask Questions
                        </NavLink>
                    </li>

                    {role === 1 && (
                        <li>
                            <NavLink to="/dashboard" className={linkClass}>
                                Dashboard
                            </NavLink>
                        </li>
                    )}
                </ul>

                <button
                    onClick={handleLogout}
                    className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>

                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <IoReorderThreeOutline size={28} />
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white shadow-md border-t border-gray-200">
                    <ul className="flex flex-col items-center space-y-4 py-4 text-gray-700 font-medium">
                        <li>
                            <NavLink
                                to="/"
                                className={linkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/ask-questions"
                                className={linkClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Ask Questions
                            </NavLink>
                        </li>

                        {role === 1 && (
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={linkClass}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}

                        <li>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
