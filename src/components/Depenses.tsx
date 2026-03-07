import Navbar from "./Navbar";
import Header from "./Header";
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppDispatch } from "../redux/hooks";
import axios from 'axios';

// Ajout des icônes pour le design Soft UI
import { FiCalendar, FiCheck, FiDollarSign, FiEdit3, FiLayers } from "react-icons/fi";

// J'ajoute "montant" car c'est une dépense, n'hésite pas à ajuster si ton backend est différent !
interface FormState {
    libelle: string;
    montant: number | null;
    created_at: Date | null;
}

export default function Depenses() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<FormState>({
        libelle: '',
        montant: null,
        created_at: new Date(),
    });

    const [loading, setLoading] = useState(false);
    const [activeSession, setActiveSession] = useState<{ id: number; libelle: string } | null>(null);

     useEffect(() => {
        const fetchLatestSession = async () => {
            try {
                // Remplace par la bonne URL de base si nécessaire
                const response = await axios.get('http://127.0.0.1:8000/api/sessions/latest-active');

                if (response.data && response.data.id) {
                    setActiveSession(response.data);
                    // On préremplit automatiquement le formulaire avec l'ID de cette session
                    setFormData(prev => ({ ...prev, session_id: response.data.id }));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la session active", error);
            }
        };

        fetchLatestSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Données de dépense soumises :', formData);
        
        // Simulation d'une requête API (à remplacer par ton action Redux ou Axios)
        setTimeout(() => {
            setLoading(false);
            // navigate('/list_depenses');
        }, 1000);
    };

    return (
        <>
            <Navbar />
          
            {/* Utilisation de main-wrapper pour éviter le chevauchement avec la Sidebar */}
            <main className="main-wrapper" style={{ backgroundColor: '#f4f7fe' }}>
                
                <div className="main-content py-3 px-3 px-md-4">
                    
                    <Header />

                    <div className="row justify-content-center m-0">
                        <div className="col-12 col-xl-10 p-0">

                            <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px' }}>
                                <div className="card-body p-4 p-md-5">

                                    <div className="text-center mb-5">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                                            <FiDollarSign size={28} />
                                        </div>
                                        <h2 className="fw-bolder" style={{ color: '#2b3674' }}>Enregistrer une Dépense</h2>
                                        <p className="text-muted">Renseignez les détails de la dépense effectuée.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>

                                        {/* Session Active (Champ désactivé pour information) */}
                                        {activeSession && (
                                            <div className="mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiLayers className="me-2 text-primary" />
                                                    Session actuelle
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg bg-light border-0"
                                                    value={activeSession.libelle}
                                                    disabled
                                                    style={{ borderRadius: '12px', fontSize: '1rem', color: '#6c757d' }}
                                                />
                                            </div>
                                        )}

                                        {/* Motif / Libellé de la dépense */}
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                <FiEdit3 className="me-2 text-primary" />
                                                Motif de la dépense
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="Ex: Achat de fournitures"
                                                value={formData.libelle}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, libelle: e.target.value })
                                                }
                                                style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            {/* Montant de la dépense */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiDollarSign className="me-2 text-primary" />
                                                    Montant (FCFA)
                                                </label>   
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg bg-light border-0"
                                                    placeholder="0.00"
                                                    value={formData.montant ?? ''}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, montant: parseFloat(e.target.value) })
                                                    }
                                                    style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                    required
                                                />
                                            </div>

                                            {/* Date de la dépense */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiCalendar className="me-2 text-primary" />
                                                    Date
                                                </label>
                                                {/* Pour éviter les débordements du calendrier, wrapperClassName="w-100" est crucial ! */}
                                                <DatePicker
                                                    selected={formData.created_at}
                                                    onChange={(date) =>
                                                        setFormData({ ...formData, created_at: date })
                                                    }
                                                    className="form-control form-control-lg bg-light border-0 w-100"
                                                    wrapperClassName="w-100"
                                                    dateFormat="dd/MM/yyyy"
                                                    style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Bouton d'action */}
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
                                                        Enregistrer la dépense
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