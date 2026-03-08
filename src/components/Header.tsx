import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Importation des icônes (Ajout de FiLogOut)
import { FiFilter, FiPlus, FiAlignRight, FiLogOut } from 'react-icons/fi';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 1. (Optionnel mais recommandé) Avertir Laravel de détruire le token côté serveur
            await axios.post('http://127.0.0.1:8000/api/logout');
        } catch (error) {
            console.error("Erreur lors de la déconnexion serveur", error);
        } finally {
            // 2. Supprimer les données locales du navigateur
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            // 3. Retirer le token par défaut d'Axios
            delete axios.defaults.headers.common['Authorization'];

            // 4. Rediriger l'utilisateur vers la page de connexion
            navigate('/login');
        }
    };

    return (
        <div className="modern-header shadow-sm bg-white">
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
                            className="btn btn-light d-flex align-items-center gap-2 border-0 fw-bold px-3 py-2" 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style={{ borderRadius: '12px', color: '#475467' }}
                        >
                            <FiFilter />
                            Filtres
                        </button>
                        <ul className="dropdown-menu shadow-sm border-0 mt-2 p-2" style={{ borderRadius: '16px', minWidth: '200px' }}>
                            <li><a className="dropdown-item fw-semibold text-muted py-2" href="#">Ce mois</a></li>
                            <li><a className="dropdown-item fw-semibold text-muted py-2" href="#">Le mois dernier</a></li>
                            <li><hr className="dropdown-divider opacity-10" /></li>
                            <li>
                                <div className="dropdown-item custom-checkbox py-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="checkTermines" />
                                        <label className="form-check-label fw-semibold text-muted" htmlFor="checkTermines">
                                            Rapports clôturés
                                        </label>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Bouton Nouveau Rapport */}
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2"
                        style={{ borderRadius: '12px', fontWeight: '600' }}
                    >
                        <FiPlus size={18} />
                        Nouveau
                    </button>

                    {/* 🔴 NOUVEAU : Bouton de Déconnexion */}
                    <button 
                        onClick={handleLogout}
                        className="btn btn-danger-soft d-flex align-items-center gap-2 px-3 py-2"
                        title="Se déconnecter"
                    >
                        <FiLogOut size={18} />
                        <span className="d-none d-md-inline fw-bold">Déconnexion</span>
                    </button>

                    {/* Bouton Toggle pour Mobile (Optionnel si tu gères la sidebar ailleurs) */}
                    <button className="btn btn-light d-lg-none p-2" style={{ borderRadius: '10px' }}>
                        <FiAlignRight size={20} />
                    </button>

                </div>
            </div>

            {/* Styles intégrés pour le composant Header */}
            <style>{`
                .modern-header {
                    background-color: #ffffff;
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

                /* 🔴 Style personnalisé pour le bouton de déconnexion Soft UI */
                .btn-danger-soft {
                    background-color: #fee4e2;
                    color: #d92d20;
                    border: none;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }

                .btn-danger-soft:hover {
                    background-color: #fec3c0;
                    color: #b42318;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
}