import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
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
      {/* MOBILE TOPBAR — visible uniquement sur mobile */}
      <div className="mobile-topbar">
        <h5 className="mobile-logo">Lucky Business</h5>
        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      {/* SIDEBAR */}
      <nav className={`nxl-navigation ${isOpen ? "mobile-open" : ""}`} >
        <div className="navbar-wrapper" style={{marginLeft:'0'}}>
          <div className="m-header">
            <h5>Lucky Business</h5>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="navbar-content">
            <ul className="nxl-navbar">

              {/* DASHBOARD */}
              <li className="nxl-item nxl-hasmenu" >
                <NavLink to="/" className="nxl-link"  style={{color:'white'}}>
                  <span className="nxl-micon" style={{color:'white'}}><i className="feather-airplay" /></span>
                  Dashboards
                  <span className="arrow"></span>
                </NavLink>
              
              </li>

              {/* SESSION */}
              <li className="nxl-item nxl-hasmenu">
                <a href="#" className="nxl-link" onClick={(e) => { e.preventDefault(); toggleMenu("session"); }} style={{color:'white'}}>
                  <span className="nxl-micon"><i className="feather-send" /></span>
                  Session
                  <span className="arrow">{activeMenu === "session" ? "▲" : "▼"}</span>
                </a>
                <ul className={`nxl-submenu ${activeMenu === "session" ? "open" : ""}`}>
                  <li>
                    <NavLink to="/session" onClick={() => setIsOpen(false)}>
                      Créer une session
                    </NavLink>
                  </li>
                  <li><a href="#">Toutes les sessions</a></li>
                </ul>
              </li>

              {/* AUTRES */}
              <li>
                <a href="#" className="nxl-link" onClick={() => setIsOpen(false)} style={{color:'white'}}>
                  <span className="nxl-micon"><i className="feather-users" /></span>
                  Gestion utilisateurs
                </a>
              </li>

              <li>
                <a href="#" className="nxl-link" style={{color:'white'}}>
                  <span className="nxl-micon"><i className="feather-users" /></span>
                  Partenaires
                </a>
              </li>

              <li >
                <a href="#" className="nxl-link" style={{color:'white'}}>
                  <span className="nxl-micon"><i className="feather-dollar-sign" /></span>
                  Dépenses
                </a>
              </li>

              <li>
                <NavLink to='/rapport' className="nxl-link" style={{color:'white'}}>
                  <span className="nxl-micon"><i className="feather-cast" /></span>
                  Rapport
                </NavLink>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        :root {
          --sidebar-width: 260px;
          --bg: #1e1e2d;
          --transition: .3s;
        }

        /* ===== DESKTOP ===== */
        .mobile-topbar {
          display: none;
        }

        .nxl-navigation {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg);
          overflow-y: auto;
          z-index: 200;
          transition: transform var(--transition);
        }

        .m-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          color: #fff;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          display: none;
        }

        .nxl-navbar {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nxl-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          color: white;
          text-decoration: none;
          transition: .2s;
          cursor: pointer;
        }

        .nxl-link:hover {
          background: rgba(108,99,255,0.2);
        }

        .arrow {
          margin-left: auto;
          font-size: 11px;
          opacity: 0.6;
        }

        /* Sous-menus */
        .nxl-submenu {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--transition) ease;
          background: rgba(255,255,255,0.04);
        }

        .nxl-submenu.open {
          max-height: 300px;
        }

        .nxl-submenu a {
          padding: 10px 18px 10px 46px;
          display: block;
          color: #ccc;
          text-decoration: none;
          transition: .2s;
        }

        .nxl-submenu a:hover {
          color: #fff;
        }

        /* ===== MOBILE ===== */
        @media (max-width: 767px) {

          /* Topbar visible sur mobile */
          .mobile-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--bg);
            color: #fff;
            padding: 12px 16px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 300;
          }

          .mobile-logo {
            margin: 0;
            font-size: 16px;
          }

          /* Hamburger */
          .hamburger {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 4px;
          }

          .hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: #fff;
            transition: var(--transition);
            transform-origin: center;
          }

          .hamburger.open span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }

          .hamburger.open span:nth-child(2) {
            opacity: 0;
          }

          .hamburger.open span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
          }

          /* Sidebar cachée par défaut sur mobile */
          .nxl-navigation {
            transform: translateX(-100%);
            z-index: 250;
          }

          /* Sidebar ouverte */
          .nxl-navigation.mobile-open {
            transform: translateX(0);
          }

          /* Bouton fermeture visible sur mobile */
          .close-btn {
            display: block;
          }

          /* Overlay */
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            z-index: 240;
          }
        }
      `}</style>
    </>
  );
}