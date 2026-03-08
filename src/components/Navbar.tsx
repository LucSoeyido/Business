import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiGrid, FiSend, FiUsers, FiDollarSign, FiFileText, FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const location = useLocation(); 

  // 💡 RÉCUPÉRATION DE L'UTILISATEUR
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const isSessionActive = location.pathname === '/session' || location.pathname === '/list_session';
  const isRapportActive = location.pathname === '/rapport' || location.pathname === '/list_rapport';
  const isDepenseActive = location.pathname === '/depenses' || location.pathname === '/list_depense';

  useEffect(() => {
    if (isSessionActive) setActiveMenu('session');
    if (isRapportActive) setActiveMenu('rapport');
  }, [location.pathname, isSessionActive, isRapportActive]);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ===== MOBILE TOPBAR ===== */}
      <div className="mobile-topbar shadow-sm">
        <h5 className="mobile-logo fw-bolder mb-0">Lucky Business</h5>
        <button
          className="mobile-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ===== OVERLAY (MOBILE) ===== */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* ===== SIDEBAR ===== */}
      <aside className={`modern-sidebar shadow-sm ${isOpen ? "open" : ""}`}>
        
        <div className="sidebar-header">
          <h3 className="brand-title">Lucky Business</h3>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-nav">

            {/* DASHBOARD */}
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <FiGrid className="nav-icon" />
                <span>Dashboards</span>
              </NavLink>
            </li>

            <div className="nav-divider">Gestion</div>

            {/* 🔴 SESSION (Visible UNIQUEMENT pour l'administrateur) */}
            {currentUser && currentUser.role === 'administrateur' && (
              <li className="nav-item">
                <button 
                  className={`nav-link ${isSessionActive ? 'active' : ''} ${activeMenu === "session" && !isSessionActive ? "expanded" : ""}`} 
                  onClick={() => toggleMenu("session")}
                >
                  <FiSend className="nav-icon" />
                  <span>Session</span>
                  {activeMenu === "session" ? <FiChevronUp className="nav-arrow" /> : <FiChevronDown className="nav-arrow" />}
                </button>
                <ul className={`nav-submenu ${activeMenu === "session" ? "open" : ""}`}>
                  <li><NavLink to="/session" onClick={() => setIsOpen(false)}>Créer une session</NavLink></li>
                  <li><NavLink to="/list_session" onClick={() => setIsOpen(false)}>Toutes les sessions</NavLink></li>
                </ul>
              </li>
            )}

            {/* RAPPORTS */}
            <li className="nav-item">
              <button 
                className={`nav-link ${isRapportActive ? 'active' : ''} ${activeMenu === "rapport" && !isRapportActive ? "expanded" : ""}`} 
                onClick={() => toggleMenu("rapport")}
              >
                <FiFileText className="nav-icon" />
                <span>Rapports</span>
                {activeMenu === "rapport" ? <FiChevronUp className="nav-arrow" /> : <FiChevronDown className="nav-arrow" />}
              </button>
              <ul className={`nav-submenu ${activeMenu === "rapport" ? "open" : ""}`}>
                <li><NavLink to="/rapport" onClick={() => setIsOpen(false)}>Créer un rapport</NavLink></li>
                <li><NavLink to="/list_rapport" onClick={() => setIsOpen(false)}>Tous les rapports</NavLink></li>
              </ul>
            </li>

            <div className="nav-divider">Finances & Contacts</div>
                 {/* DÉPENSES */}
              <li className="nav-item">
              <button 
                className={`nav-link ${isDepenseActive ? 'active' : ''} ${activeMenu === "depense" && !isDepenseActive ? "expanded" : ""}`} 
                onClick={() => toggleMenu("depense")}
              >
                 <FiDollarSign className="nav-icon" />
                <span>Dépenses</span>
                {activeMenu === "depense" ? <FiChevronUp className="nav-arrow" /> : <FiChevronDown className="nav-arrow" />}
              </button>
              <ul className={`nav-submenu ${activeMenu === "depense" ? "open" : ""}`}>
                <li><NavLink to="/depenses" onClick={() => setIsOpen(false)}>Créer un depense</NavLink></li>
                <li><NavLink to="/list_depense" onClick={() => setIsOpen(false)}>Tous les depenses</NavLink></li>
              </ul>
            </li>

         
           

            {/* PARTENAIRES */}
            <li className="nav-item">
              <NavLink to="/partenaires" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                <FiUsers className="nav-icon" />
                <span>Partenaires</span>
              </NavLink>
            </li>

            {/* 🔴 UTILISATEURS (Visible UNIQUEMENT pour l'administrateur) */}
            {currentUser && currentUser.role === 'administrateur' && (
              <li className="nav-item">
                <NavLink to="/utilisateurs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                  <FiUsers className="nav-icon" />
                  <span>Utilisateurs</span>
                </NavLink>
              </li>
            )}

          </ul>
        </div>
      </aside>

      {/* ===== STYLES CSS ===== */}
      <style>{`
        :root {
          --sidebar-width: 280px;
          --sidebar-bg: #000000;
          --text-main: #ffffff;
          --text-muted: #a0aec0;
          --primary-color: #4318FF;
          --hover-bg: #1a202c;
          --transition-speed: 0.3s;
        }

        .mobile-topbar {
          display: none;
          justify-content: space-between;
          align-items: center;
          background: var(--sidebar-bg);
          padding: 15px 20px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-logo { color: var(--text-main); font-weight: 800; }
        .mobile-toggle-btn { background: none; border: none; color: var(--text-main); cursor: pointer; display: flex; align-items: center; padding: 5px; }

        .modern-sidebar {
          position: fixed; top: 0; left: 0; width: var(--sidebar-width); height: 100vh;
          background: var(--sidebar-bg); z-index: 1050; display: flex; flex-direction: column;
          transition: transform var(--transition-speed) ease;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-header { padding: 30px 24px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .brand-title { font-size: 22px; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.5px; }
        .sidebar-content { flex: 1; overflow-y: auto; padding: 24px 16px; }
        .sidebar-nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .nav-divider { font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px 16px; }
        
        .nav-item { display: flex; flex-direction: column; }

        .nav-link {
          display: flex; align-items: center; width: 100%; padding: 12px 16px; border-radius: 12px;
          color: var(--text-muted); text-decoration: none; font-weight: 600; font-size: 15px;
          background: transparent; border: none; cursor: pointer; transition: all 0.2s ease; text-align: left;
        }

        .nav-link:hover, .nav-link.expanded { background-color: var(--hover-bg); color: #ffffff; }

        .nav-link.active {
          background-color: var(--primary-color);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(67, 24, 255, 0.3);
        }

        .nav-icon { font-size: 20px; margin-right: 14px; min-width: 20px; }
        .nav-arrow { margin-left: auto; font-size: 18px; }

        .nav-submenu { list-style: none; padding: 0; margin: 0; max-height: 0; overflow: hidden; transition: max-height var(--transition-speed) ease; }
        .nav-submenu.open { max-height: 200px; margin-top: 4px; }
        .nav-submenu li a { display: block; padding: 10px 16px 10px 50px; color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s ease; }
        
        .nav-submenu li a:hover, .nav-submenu li a.active {
          color: #ffffff;
          font-weight: 700;
        }

        @media (max-width: 1023px) {
          .mobile-topbar { display: flex; }
          .modern-sidebar { transform: translateX(-100%); }
          .modern-sidebar.open { transform: translateX(0); }
          .sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); z-index: 1040; }
        }
      `}</style>
    </>
  );
}