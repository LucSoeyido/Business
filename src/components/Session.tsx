import Navbar from "./Navbar";
import Header from "./Header";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { createSession } from "../redux/slices/sessionSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Ajout des icônes pour le design Soft UI
import { FiCalendar, FiCheck, FiEdit3, FiLayers } from "react-icons/fi";

// 💡 Astuce : Il est préférable de déclarer l'interface en dehors du composant 
// pour éviter qu'elle ne soit recréée à chaque rendu.
interface FormState {
    libelle: string;
    created_at: Date | null;
    date_cloture: Date | null;
}

export default function Session() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormState>({
        libelle: '',
        created_at: new Date(),
        date_cloture: null,
    });

    const [loading, setLoading] = useState(false); // Ajout d'un state de chargement fictif pour le bouton

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createSession(formData)).unwrap();
            setFormData({
                libelle: '',
                created_at:new Date(),
                date_cloture:null

               
            });
            navigate('/list_session');
        } catch (error) {
            console.error("L'ajout a échoué :", error);
        }
    };

    return (
        <>
            <Navbar />

            {/* Utilisation de main-wrapper pour éviter le chevauchement avec la Sidebar */}
            <main className="main-wrapper" style={{ backgroundColor: '#f4f7fe' }}>

                {/* Réduction de l'espace haut/bas avec py-3 */}
                <div className="main-content py-3 px-3 px-md-4">

                    {/* Ton bel en-tête */}
                    <Header />

                    {/* Centrage de la carte pour éviter qu'elle ne soit trop étirée sur les grands écrans */}
                    <div className="row justify-content-center m-0">
                        <div className="col-12 col-xl-10 p-0">

                            {/* Design de la carte : Bords très arrondis, pas de bordure, ombre douce (Soft UI) */}
                            <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px' }}>
                                <div className="card-body p-4 p-md-5">

                                    {/* En-tête du formulaire stylisé */}
                                    <div className="text-center mb-5">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                                            <FiLayers size={28} />
                                        </div>
                                        <h2 className="fw-bolder" style={{ color: '#2b3674' }}>Nouvelle Session</h2>
                                        <p className="text-muted">Définissez les paramètres de votre nouvelle session de travail.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>

                                        {/* Libellé de la session */}
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                <FiEdit3 className="me-2 text-primary" />
                                                Libellé de la session
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="Ex: Session de Printemps"
                                                value={formData.libelle}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, libelle: e.target.value })
                                                }
                                                style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            {/* Date de démarrage */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiCalendar className="me-2 text-primary" />
                                                    Date de démarrage
                                                </label>
                                                <DatePicker
                                                    selected={formData.created_at}
                                                    onChange={(date) =>
                                                        setFormData({ ...formData, created_at: date })
                                                    }
                                                    className="form-control form-control-lg bg-light border-0 w-100"
                                                    wrapperClassName="w-100"
                                                    dateFormat="dd/MM/yyyy"
                                                    style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                />
                                            </div>

                                            {/* Date de clôture */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiCalendar className="me-2 text-primary" />
                                                    Date de clôture
                                                </label>
                                                <DatePicker
                                                    selected={formData.date_cloture}
                                                    onChange={(date) =>
                                                        setFormData({ ...formData, date_cloture: date })
                                                    }
                                                    className="form-control form-control-lg bg-light border-0 w-100"
                                                    wrapperClassName="w-100"
                                                    minDate={formData.created_at || undefined}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Sélectionnez une date"
                                                    style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Bouton d'action mis en valeur */}
                                        <div className="mt-5">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg w-100 shadow-sm d-flex justify-content-center align-items-center"
                                                style={{ borderRadius: '12px', padding: '14px 0', fontWeight: '600' }}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <>
                                                        <FiCheck className="me-2" size={20} />
                                                        Enregistrer la session
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            {/* Styles pour gérer la Sidebar et les inputs */}
            <style>{`
                .main-wrapper {
                    margin-left: 280px; 
                    min-height: 100vh;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1023px) {
                    .main-wrapper {
                        margin-left: 0;
                        padding-top: 70px; 
                    }
                }
                
                .form-control:focus {
                    box-shadow: none;
                }
            `}</style>
        </>
    );
}