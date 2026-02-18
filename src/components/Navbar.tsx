"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Fermer le menu si on redimensionne vers desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Empêcher le scroll du body quand le menu est ouvert sur mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Barre supérieure mobile (visible seulement < md) ── */}
      <div className="mobile-topbar">
        <h5 className="mobile-logo">Lucky Business</h5>
        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ── Overlay (mobile) ── */}
      {isOpen && (
        <div
          className="overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <nav className={`nxl-navigation ${isOpen ? "mobile-open" : ""}`} >
        <div className="navbar-wrapper">
          <div className="m-header p-3" style={{backgroundColor:'#1e1e2d'}}>
            <h5 style={{color:'blue'}}>Lucky Business</h5>
            {/* Bouton fermer (mobile) */}
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="navbar-content">
            <ul className="nxl-navbar" >
              

              <li className="nxl-item">
                <a style={{color:'blue'}} className="nxl-link" href="#" onClick={() => setIsOpen(false)}>
                  Dashboard
                </a>
              </li>

              <li className="nxl-item">
                <a style={{color:'blue'}} className="nxl-link" href="#" onClick={() => setIsOpen(false)}>
                  Customers
                </a>
              </li>

              <li className="nxl-item">
                <a style={{color:'blue'}} className="nxl-link" href="#" onClick={() => setIsOpen(false)}>
                  Payments
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        /* ── Variables ── */
        :root {
          --sidebar-width: 260px;
          --topbar-height: 56px;
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --bg: #1e1e2d;
          --text: #e0e0f0;
          --accent: #6c63ff;
        }

        /* ── Sidebar (desktop : toujours visible) ── */
        .nxl-navigation {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          overflow-y: auto;
          z-index: 200;
          transition: transform var(--transition);
          /* Sur desktop, forcer la sidebar à être toujours visible */
          transform: translateX(0) !important;
        }

        .navbar-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .m-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .m-header h5 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text);
        }

        /* Bouton ✕ (mobile seulement) */
        .close-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px 8px;
        }

        .navbar-content {
          overflow-y: auto;
          flex: 1;
          padding: 0.5rem 0;
        }

        .nxl-navbar {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nxl-caption label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.35);
          padding: 0.75rem 1rem 0.25rem;
          display: block;
        }

        .nxl-link {
          display: block;
          padding: 0.65rem 1.25rem;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          border-radius: 6px;
          margin: 2px 8px;
          transition: background var(--transition), color var(--transition);
          font-size: 0.92rem;
        }

        .nxl-link:hover {
          background: rgba(108,99,255,0.18);
          color: #fff;
        }

        /* ── Topbar mobile (cachée sur desktop) ── */
        .mobile-topbar {
          display: none;
        }

        /* ── Overlay ── */
        .overlay {
          display: none;
        }

        /* ── Hamburger ── */
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
          border-radius: 2px;
          transition: transform var(--transition), opacity var(--transition);
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

        /* ── Responsive ── */
        @media (max-width: 767px) {
          /* Sidebar cachée par défaut, apparaît en slide */
          /* On override le !important du desktop */
          .nxl-navigation {
            transform: translateX(-100%) !important;
            z-index: 300;
          }

          .nxl-navigation.mobile-open {
            transform: translateX(0) !important;
          }

          /* Afficher le bouton ✕ dans le header de la sidebar */
          .close-btn {
            display: block;
          }

          /* Topbar mobile visible */
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--topbar-height);
            background: var(--bg);
            color: var(--text);
            padding: 0 1rem;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }

          .mobile-logo {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
          }

          /* Overlay semi-transparent */
          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            z-index: 200;
            backdrop-filter: blur(2px);
          }
        }
      `}</style>
    </>
  );
}