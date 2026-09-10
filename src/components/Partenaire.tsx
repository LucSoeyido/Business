import Navbar from "./Navbar";
import { fetchPartenairesTotal } from "../redux/slices/partenaireSlice";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { MutatingDots } from 'react-loader-spinner';
import { NavLink } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Ajout d'icônes modernes
import { FiFileText, FiPlus, FiSearch, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function Partenaire() {
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState('');

    // Champs du formulaire
    const [partenaire, setPartenaire] = useState('');
    const [dateDemarrage, setDateDemarrage] = useState<Date | null>(null);
    const [dateCloture, setDateCloture] = useState<Date | null>(null);

    // Résultat du calcul "1 partenaire / 1 période" (bouton Calculer)
    const [calculLoading, setCalculLoading] = useState(false);
    const [calculError, setCalculError] = useState<string | null>(null);
    const [resultatCalcul, setResultatCalcul] = useState<{
        partenaire: string;
        total: number;
        date_debut: string;
        date_fin: string;
    } | null>(null);

    // On oublie la pagination : le slice renvoie directement la liste des
    // partenaires avec leur montant total, déjà triée du plus élevé au plus petit.
    const { partenaires, loading } = useAppSelector((state) => state.partenaire);

    useEffect(() => {
        dispatch(fetchPartenairesTotal());
    }, [dispatch]);

    // Formate une date en YYYY-MM-DD (format attendu par l'API Laravel)
    const formatDateForApi = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!partenaire || !dateDemarrage || !dateCloture) return;

        setCalculError(null);
        setResultatCalcul(null);
        setCalculLoading(true);

        try {
            const params = new URLSearchParams({
                partenaire,
                date_debut: formatDateForApi(dateDemarrage),
                date_fin: formatDateForApi(dateCloture),
            });
            const token = localStorage.getItem('auth_token');

            if (!token) {
                throw new Error("Token d'authentification introuvable.");
            }

            const response = await fetch(
                `https://apibusiness.lucky-dev.com/api/rapports/total-date-par-partenaire?${params.toString()}`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Réponse serveur :", errorText);

                throw new Error(
                    `Erreur serveur : ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            console.log("Réponse API :", data);

            setResultatCalcul(data);

        } catch (error) {
            console.error("Erreur calcul :", error);

            setCalculError(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors du calcul."
            );

        } finally {
            setCalculLoading(false);
        }
    };

    // Filtrage local (le slice ne gère plus la recherche côté serveur)
    const partenairesFiltres = (partenaires || []).filter((p) =>
        p.partenaire.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />

            <main className="main-wrapper">
                <div className="main-content py-4 px-3 px-md-4">
                    <form onSubmit={handleSubmit}>

                        {/* Section Partenaire */}
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                <FiFileText className="me-2 text-primary" />
                                Partenaire
                            </label>
                            {/* Style des champs : fond légèrement grisé, pas de bordure forte, padding généreux */}
                            <select
                                value={partenaire}
                                onChange={(e) => setPartenaire(e.target.value)}
                                className="form-select form-select-lg bg-light border-0"
                                style={{ borderRadius: '12px', fontSize: '1rem' }}
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
                                <option value="Bonnet"> Bonnet</option>
                                <option value="Adélin">Adélin</option>
                                <option value="Attiéké">Attiéké</option>
                                <option value="Djifa">Djifa</option>
                                <option value="Dora">Dora</option>
                                <option value="Tassi justine">Tassi justine</option>
                                <option value="josephine">josephine</option>
                                <option value="Fogan_Didier">Fogan_Didier</option>
                                <option value="P.JOSUE">P.JOSUE</option>
                                <option value="FK">FK</option>
                                <option value="JOEL">JOEL</option>
                                <option value="Autres">Autres</option>
                            </select>
                        </div>

                        <div className="row">
                            {/* Date de démarrage */}
                            <div className="col-12 col-md-6 mb-4">
                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                    <FiCalendar className="me-2 text-primary" />
                                    Date de démarrage
                                </label>
                                <DatePicker
                                    selected={dateDemarrage}
                                    onChange={(date) => setDateDemarrage(date)}
                                    className="form-control form-control-lg bg-light border-0 w-100"
                                    wrapperClassName="w-100"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Sélectionnez une date"
                                    selectsStart
                                    startDate={dateDemarrage}
                                    endDate={dateCloture}
                                    required
                                />
                            </div>

                            {/* Date de fin */}
                            <div className="col-12 col-md-6 mb-4">
                                <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                    <FiCalendar className="me-2 text-primary" />
                                    Date de fin
                                </label>
                                <DatePicker
                                    selected={dateCloture}
                                    onChange={(date) => setDateCloture(date)}
                                    className="form-control form-control-lg bg-light border-0 w-100"
                                    wrapperClassName="w-100"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Sélectionnez une date"
                                    selectsEnd
                                    startDate={dateDemarrage}
                                    endDate={dateCloture}
                                    minDate={dateDemarrage ?? undefined}
                                    required
                                />
                            </div>
                        </div>

                        {/* Bouton d'action mis en valeur */}
                        <div className="mt-5">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 shadow-sm d-flex justify-content-center align-items-center"
                                style={{ borderRadius: '12px', padding: '14px 0', fontWeight: '600' }}
                                disabled={calculLoading}
                            >
                                {calculLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        <FiPlus className="me-2" size={14} />
                                        Calculer
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Message d'erreur du calcul */}
                        {calculError && (
                            <div className="alert alert-danger mt-3 mb-0" role="alert">
                                {calculError}
                            </div>
                        )}

                        {/* Résultat du calcul pour le partenaire + la période sélectionnés */}
                        {resultatCalcul && (
                            <div
                                className="mt-3 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
                                style={{ backgroundColor: '#eafaf0', border: '1px solid #b7ebc6', borderRadius: '12px' }}
                            >
                                <div>
                                    <small
                                        className="text-muted d-block mb-1"
                                        style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}
                                    >
                                        <FiDollarSign className="me-1" />
                                        Total reçu par {resultatCalcul.partenaire}
                                    </small>
                                    <span className="fw-bolder font-monospace" style={{ fontSize: '1.4rem', color: '#0f9d58' }}>
                                        {resultatCalcul.total.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <div className="text-muted small">
                                    du {new Date(resultatCalcul.date_debut).toLocaleDateString('fr-FR')} au{' '}
                                    {new Date(resultatCalcul.date_fin).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        )}

                    </form>

                    {/* En-tête de la page */}
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3" style={{ lineHeight: '80px' }}>
                        <div className="d-flex align-items-center header-left-block">
                            <div className="icon-box bg-white text-primary shadow-sm me-3 flex-shrink-0">
                                <FiFileText size={24} />
                            </div>
                            <div className="flex-grow-1 text-truncate" >
                                <h2 className="fw-bolder mb-0 text-main text-truncate">Totaux par Partenaire</h2>
                                <p className="text-muted mb-0 small text-truncate">Montant total cumulé par partenaire</p>
                            </div>
                        </div>

                        {/* Zone de recherche et bouton d'ajout */}
                        <div className="d-flex flex-row gap-2 action-container header-right-block justify-content-lg-end">
                            <div className="input-group shadow-sm flex-grow-1" style={{ borderRadius: '12px', overflow: 'hidden', maxWidth: '400px' }}>
                                <span className="input-group-text bg-white border-0 text-muted px-3">
                                    <FiSearch size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 ps-0 shadow-none bg-white search-input"
                                    placeholder="Rechercher un partenaire..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>


                        </div>
                    </div>

                    {/* Carte globale */}
                    <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-0">

                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                    <MutatingDots height="80" width="80" color="#4318FF" visible={true} />
                                </div>
                            ) : (
                                <>
                                    {partenairesFiltres.length > 0 ? (
                                        <>
                                            {/* ===== VERSION BUREAU (TABLEAU) ===== */}
                                            <div className="d-none d-md-block table-responsive">
                                                <table className="table modern-table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Partenaire</th>
                                                            <th>Montant total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {partenairesFiltres.map((p) => (
                                                            <tr key={p.partenaire} className="align-middle">
                                                                <td className="fw-bold text-main">{p.partenaire}</td>
                                                                <td className="text-success fw-bolder font-monospace">
                                                                    {p.total.toLocaleString()} FCFA
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* ===== VERSION MOBILE (CARTES) ===== */}
                                            <div className="d-block d-md-none p-3 bg-light">
                                                {partenairesFiltres.map((p) => (
                                                    <div key={p.partenaire} className="card border-0 shadow-sm mb-3 mobile-card">
                                                        <div className="card-body p-3">

                                                            <h5 className="fw-bold text-main mb-3 prevent-overflow">{p.partenaire}</h5>

                                                            <div className="d-flex justify-content-between align-items-end p-2 rounded-3 bg-white border">
                                                                <div className="pe-2">
                                                                    <small className="text-muted d-block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                                                                        <FiDollarSign className="me-1" />Montant total
                                                                    </small>
                                                                    <span className="text-success fw-bolder font-monospace prevent-overflow d-block" style={{ fontSize: '15px' }}>
                                                                        {p.total.toLocaleString()} FCFA
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            {searchTerm !== ''
                                                ? `Aucun partenaire trouvé pour "${searchTerm}".`
                                                : "Aucun partenaire trouvé."}
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* ===== STYLES CSS ===== */}
            <style>{`
                .text-main { color: #2b3674; }

                /* Empêcher le débordement de texte long (ex: libellé très long sans espaces) */
                .prevent-overflow {
                    word-break: break-word;
                    white-space: normal;
                    overflow-wrap: break-word;
                }

                html, body {
                    overflow-x: hidden;
                    max-width: 100%;
                }

                .main-wrapper {
                    margin-left: 280px;
                    background-color: #f4f7fe;
                    min-height: 100vh;
                    transition: margin-left 0.3s ease;
                    box-sizing: border-box;
                }

                .main-content {
                    width: 100%;
                    box-sizing: border-box;
                }

                /*
                  Correctif : sur grand écran (flex-lg-row), les deux enfants de
                  l'en-tête (bloc titre + bloc recherche/bouton) portaient CHACUN
                  la classe w-100. Deux éléments flex qui demandent 100% de
                  largeur chacun sur une même ligne se disputent l'espace : le
                  navigateur doit les compresser tous les deux de façon
                  imprévisible (c'est exactement la déformation visible sur la
                  capture). On force donc une largeur "auto" côté desktop et on
                  laisse flexbox répartir l'espace normalement.
                */
                .header-left-block,
                .header-right-block {
                    width: 100%;
                    min-width: 0; /* nécessaire pour que text-truncate fonctionne dans un flex item */
                }

                @media (min-width: 992px) {
                    .header-left-block {
                        width: auto;
                        flex: 1 1 auto;
                    }
                    .header-right-block {
                        width: auto;
                        flex: 0 1 auto;
                    }
                }

                .btn-nouveau {
                    border-radius: 12px;
                    padding: 10px 20px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                /* COMPORTEMENT MOBILE : bouton icône seule, carré, sous la recherche */
                @media (max-width: 575px) {
                    .action-container {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                    .action-container .input-group {
                        max-width: 65% !important;
                        height: 38px !important;
                        font-size: 13px !important;
                    }
                    .action-container .input-group .input-group-text {
                        padding: 0 10px !important;
                    }
                    .action-container .input-group .form-control {
                        font-size: 13px !important;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .btn-nouveau {
                        width: 44px !important;
                        height: 44px !important;
                        padding: 0 !important;
                        border-radius: 12px !important;
                    }
                    .btn-nouveau-label {
                        display: none;
                    }
                    .icon-plus {
                        margin: 0 !important;
                        font-size: 20px;
                    }
                }

                @media (max-width: 1023px) {
                    .main-wrapper {
                        margin-left: 0;
                        padding-top: 70px;
                        width: 100%;
                        max-width: 100vw;
                    }

                    .main-content {
                        padding-left: 12px !important;
                        padding-right: 12px !important;
                    }

                    .card {
                        max-width: 100%;
                        box-sizing: border-box;
                    }
                }

                .icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modern-table { border-collapse: separate; border-spacing: 0; }
                .modern-table thead th { background-color: #f8f9fa; color: #a3aed1; font-size: 12px; text-transform: uppercase; font-weight: 700; padding: 18px 24px; border-bottom: 1px solid #e9ecef; border-top: none; }
                .modern-table tbody td { padding: 16px 24px; border-bottom: 1px solid #f4f7fe; color: #475467; }
                .modern-table tbody tr:hover td { background-color: #f8f9fa; }
                .modern-table tbody tr:last-child td { border-bottom: none; }

                .mobile-card {
                    border-radius: 16px !important;
                    transition: transform 0.2s ease;
                }
                .mobile-card:active {
                    transform: scale(0.98);
                }

                .form-control:focus { box-shadow: none; }
            `}</style>
        </>
    );
}
