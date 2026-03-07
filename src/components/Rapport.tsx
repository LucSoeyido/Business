import Navbar from "./Navbar";
import Header from "./Header"; // N'oublie pas d'importer ton nouveau Header !
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { createRapport } from "../redux/slices/rapportSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from 'axios'; // Assure-toi d'importer axios

// Importation d'icônes modernes et minimalistes
import { FiUser, FiCalendar, FiDollarSign, FiCheck, FiFileText } from "react-icons/fi";

interface FormContr {
    libelle: string;
    created_at: Date | null;
    montant: number | null;
    session_id: number;
}

export default function Rapport() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading } = useAppSelector((state) => state.rapport);

    const [formData, setFormData] = useState<FormContr>({
        libelle: '',
        created_at: new Date(),
        montant: null,
        session_id: 0
    });

    // Nouvel état pour stocker la session récupérée pour l'affichage du select
    const [activeSession, setActiveSession] = useState<{ id: number; libelle: string } | null>(null);

    // Récupération de la dernière session active au montage du composant
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
        try {
            await dispatch(createRapport(formData)).unwrap();
            setFormData({
                libelle: '',
                created_at: null,
                montant: null,
                session_id: 1
            });
            navigate('/list_rapport');
        } catch (error) {
            console.error("L'ajout a échoué :", error);
        }
    };

    return (
        <>
            <Navbar />

            {/* Utilisation de main-wrapper pour éviter le chevauchement avec la Sidebar */}
            <main className="main-wrapper" style={{ backgroundColor: '#f4f7fe' }}>

                {/* Réduction de l'espace haut/bas en passant de py-5 à py-3 */}
                <div className="main-content py-3 px-3 px-md-4">

                    {/* Ajout de ton bel en-tête ici ! */}
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
                                            <FiFileText size={28} />
                                        </div>
                                        <h2 className="fw-bolder" style={{ color: '#2b3674' }}>Nouveau Rapport</h2>
                                        <p className="text-muted">Remplissez les informations ci-dessous pour enregistrer une nouvelle entrée.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>

                                        {/* Section Partenaire */}
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                <FiUser className="me-2 text-primary" />
                                                Partenaire
                                            </label>
                                            {/* Style des champs : fond légèrement grisé, pas de bordure forte, padding généreux */}
                                            <select
                                                value={formData.libelle}
                                                className="form-select form-select-lg bg-light border-0"
                                                style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, libelle: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="" disabled>Sélectionner un partenaire dans la liste</option>
                                                <option value="Basile">Basile</option>
                                                <option value="Mawulinon">Mawulinon</option>
                                                <option value="Martina">Martina</option>
                                                <option value="Léa">Léa</option>
                                                <option value="Téla David">Téla David</option>
                                                <option value="Doky">Doky</option>
                                                <option value="Base">Base</option>
                                                <option value="Eugène">Eugène</option>
                                                <option value="Démarcheur">Démarcheur</option>
                                                <option value="Maman Doky">Maman Doky</option>
                                                <option value="Adélin">Adélin</option>
                                                <option value="Tassi justine">Tassi justine</option>
                                                <option value="josephine">josephine</option>
                                                <option value="Autres">Autres</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold text-main">Session Associée</label>
                                            <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                                <span className="input-group-text bg-white border-0 text-muted px-3">
                                                    <FiCalendar size={18} /> {/* Tu peux changer l'icône selon ton design */}
                                                </span>
                                                <select
                                                    className="form-select border-0 ps-0 shadow-none bg-white"
                                                    value={formData.session_id}
                                                    onChange={(e) => setFormData({ ...formData, session_id: Number(e.target.value) })}
                                                    required
                                                >
                                                    {activeSession ? (
                                                        <option value={activeSession.id}>{activeSession.libelle}</option>
                                                    ) : (
                                                        <option value="">Chargement de la session active...</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* Section Date */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiCalendar className="me-2 text-primary" />
                                                    Date du rapport
                                                </label>
                                                <DatePicker
                                                    selected={formData.created_at}
                                                    onChange={(date) =>
                                                        setFormData({ ...formData, created_at: date })
                                                    }
                                                    // Classes Bootstrap pour agrandir le champ et le rendre "Soft"
                                                    className="form-control form-control-lg bg-light border-0 w-100"
                                                    wrapperClassName="w-100"
                                                    dateFormat="dd/MM/yyyy"
                                                    style={{ borderRadius: '12px', fontSize: '1rem' }}
                                                />
                                            </div>

                                            {/* Section Montant */}
                                            <div className="col-12 col-md-6 mb-4">
                                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                                    <FiDollarSign className="me-2 text-primary" />
                                                    Montant
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.montant ?? ""}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, montant: parseFloat(e.target.value) })
                                                    }
                                                    className="form-control form-control-lg bg-light border-0"
                                                    placeholder="0.00"
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
                                                        Enregistrer le rapport
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
            <style>{`
                /* Ce code pousse le formulaire vers la droite pour laisser la place à ta Navbar noire */
                .main-wrapper {
                    margin-left: 280px; /* Doit correspondre à la largeur de ta Navbar */
                    min-height: 100vh;
                    transition: margin-left 0.3s ease;
                }
                
                /* Sur téléphone, on annule la marge et on laisse de l'espace en haut pour le menu mobile */
                @media (max-width: 1023px) {
                    .main-wrapper {
                        margin-left: 0;
                        padding-top: 70px; 
                    }
                }
            `}</style>
        </>
    );

}