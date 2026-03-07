import React from 'react';
// Importation des icônes pour remplacer les anciennes classes "feather-*"
import { FiFilter, FiPlus, FiAlignRight } from 'react-icons/fi';

export default function Header() {
    return (
        <div className="modern-header shadow-sm">
            <div className="d-flex justify-content-between align-items-center w-100">
                
                {/* Section Gauche : Titre & Fil d'Ariane (Breadcrumb) */}
                <div className="header-left">
                    <h4 className="header-title fw-bolder mb-1">Rapports</h4>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <a href="/" className="text-muted text-decoration-none fw-semibold">Accueil</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#4318FF', fontWeight: '700' }}>
                                Ventes
                            </li>
                        </ol>
                    </nav>
                </div>

                {/* Section Droite : Actions & Boutons */}
                <div className="header-right d-flex align-items-center gap-3">
                    
                    {/* Menu déroulant des filtres */}
                    <div className="dropdown">
                        <button 
                            className="btn btn-light d-flex align-items-center shadow-sm" 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: '600', color: '#475467', backgroundColor: '#ffffff', border: '1px solid #e9ecef' }}
                        >
                            <FiFilter className="me-2" />
                            <span>Filtrer</span>
                        </button>
                        
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" style={{ borderRadius: '16px', padding: '12px', minWidth: '220px' }}>
                            {['Rôle', 'Équipe', 'Email', 'Membre', 'Recommandation'].map((item) => (
                                <li key={item}>
                                    <div className="form-check custom-checkbox px-3 py-2">
                                        <input className="form-check-input" type="checkbox" id={item} defaultChecked />
                                        <label className="form-check-label c-pointer ms-2 fw-medium text-dark" htmlFor={item}>
                                            {item}
                                        </label>
                                    </div>
                                </li>
                            ))}
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li>
                                <a className="dropdown-item d-flex align-items-center text-primary fw-bold py-2" href="#!">
                                    <FiPlus className="me-2" size={18} /> Créer Nouveau
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item d-flex align-items-center text-muted py-2" href="#!">
                                    <FiFilter className="me-2" size={18} /> Gérer les filtres
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Bouton Ajouter Widget (Masqué sur très petits écrans) */}
                    <button 
                        className="btn btn-primary d-none d-md-flex align-items-center shadow-sm"
                        style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: '600' }}
                    >
                        <FiPlus className="me-2" size={20} />
                        <span>Ajouter Widget</span>
                    </button>

                    {/* Bouton pour menu mobile */}
                    <button className="btn btn-light d-md-none d-flex align-items-center p-2 shadow-sm" style={{ borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #e9ecef' }}>
                        <FiAlignRight size={24} color="#2b3674" />
                    </button>
                </div>
            </div>

            {/* Styles intégrés spécifiques au Header */}
            <style>{`
                .modern-header {
                    background-color: rgba(255, 255, 255, 0.85); /* Fond blanc légèrement transparent */
                    backdrop-filter: blur(12px); /* Effet de flou moderne (Glassmorphism) */
                    padding: 20px 28px;
                    border-radius: 20px; /* Bords bien arrondis */
                    margin-bottom: 28px;
                    display: flex;
                    align-items: center;
                    border: 1px solid rgba(0, 0, 0, 0.03);
                }
                
                .header-title {
                    color: #2b3674; /* Bleu marine élégant pour contraster avec ta sidebar noire */
                    font-size: 26px;
                    letter-spacing: -0.5px;
                }
                
                .breadcrumb-item a {
                    transition: color 0.2s ease;
                }

                .breadcrumb-item a:hover {
                    color: #4318FF !important; /* Couleur primaire au survol */
                }

                .custom-checkbox .form-check-input {
                    cursor: pointer;
                }

                .custom-checkbox .form-check-input:checked {
                    background-color: #4318FF;
                    border-color: #4318FF;
                }

                .dropdown-item {
                    border-radius: 10px;
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover {
                    background-color: #f4f7fe;
                    transform: translateX(3px); /* Petite animation au survol */
                }
            `}</style>
        </div>
    );
}