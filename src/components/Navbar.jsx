import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState("freelancer");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ For Mobile Menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const freelancerLinks = [
    { name: "Browse Gigs", path: "/" },
    { name: "My Bids", path: "/my-bids" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const clientLinks = [
    { name: "Create Gig", path: "/create-gig" },
    { name: "Manage Postings", path: "/my-gigs" },
    { name: "Client Console", path: "/client-dashboard" },
  ];

  const currentLinks = viewMode === "freelancer" ? freelancerLinks : clientLinks;

  const fetchNotifs = async () => {
    try { 
      if (user) { 
        const res = await api.get("/notifications"); 
        if (res.data.success) setNotifications(res.data.notifications); 
      } 
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleNotifs = async () => {
    setIsNotifOpen(!isNotifOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (!isNotifOpen && unreadCount > 0) {
      try { 
        await api.put("/notifications/mark-read"); 
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); 
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">GigBoard</span>
          </Link>

          {/* Center: Desktop Mode Switcher */}
          {user && (
            <div className="hidden lg:flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl items-center">
              <button 
                onClick={() => { setViewMode("freelancer"); navigate("/dashboard"); }}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "freelancer" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                Freelancer
              </button>
              <button 
                onClick={() => { setViewMode("client"); navigate("/client-dashboard"); }}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "client" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                Client
              </button>
            </div>
          )}

          {/* Desktop Links & Actions */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {user && currentLinks.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                {link.name}
              </Link>
            ))}
            
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-amber-400">
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="relative" ref={notifRef}>
                  <button onClick={handleToggleNotifs} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}
                  </button>
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-[100]">
                      <div className="px-4 py-2 border-b dark:border-slate-800"><h3 className="text-xs font-black uppercase dark:text-white">Notifications</h3></div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? <p className="p-6 text-xs text-center text-gray-400">No alerts</p> : 
                          notifications.map(n => (
                            <div key={n._id} className={`p-4 text-sm border-b dark:border-slate-800/50 ${!n.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                              <p className="dark:text-slate-300 leading-tight">{n.message}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                    {userInitial}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl py-2">
                      <div className="px-4 py-2 border-b dark:border-slate-700">
                        <p className="text-sm font-medium dark:text-white truncate">{user.name}</p>
                      </div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium dark:text-slate-300">Login</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full">Join</Link>
              </div>
            )}
          </div>

          {/* Mobile Right Actions: Theme & Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
             <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-amber-400">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-4">
            
            {/* Mobile Mode Switcher */}
            {user && (
              <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full">
                <button 
                  onClick={() => { setViewMode("freelancer"); navigate("/dashboard"); setIsMobileMenuOpen(false); }}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "freelancer" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-gray-400"}`}
                >
                  Freelancer
                </button>
                <button 
                  onClick={() => { setViewMode("client"); navigate("/client-dashboard"); setIsMobileMenuOpen(false); }}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "client" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-gray-400"}`}
                >
                  Client
                </button>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1">
              {user ? (
                <>
                  <div className="py-2 mb-2 border-b dark:border-slate-800">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Navigation</p>
                    {currentLinks.map((link) => (
                      <Link 
                        key={link.path} 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2.5 text-base font-medium text-gray-700 dark:text-slate-300"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="py-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Account</p>
                    <p className="text-sm font-medium dark:text-white mb-3">Logged in as {user.name}</p>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 font-bold text-center"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center font-bold dark:text-white border dark:border-slate-700 rounded-xl">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center font-bold text-white bg-indigo-600 rounded-xl">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;