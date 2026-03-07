import Navbar from "./Navbar";
import { fetchSession, deleteSession } from "../redux/slices/sessionSlice";
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { MutatingDots } from 'react-loader-spinner';
import { NavLink } from "react-router-dom";

// Ajout de FiSearch pour la barre de recherche
import { FiTrash2, FiFileText, FiPlus, FiAlertCircle, FiSearch } from "react-icons/fi";

export default function ListSession() {
    const dispatch = useAppDispatch();

    // États pour le modal
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
    const [deleteTacheName, setDeleteTacheName] = useState('');

    // États pour la recherche
    const [searchTerm, setSearchTerm] = useState('');

    const { sessions, loading, pagination } = useAppSelector((state) => state.session);

    // Système de Debounce : déclenche la recherche avec un léger délai
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // On envoie la recherche en réinitialisant à la page 1
            dispatch(fetchSession({ page: 1, search: searchTerm }));
        }, 500); // Délai de 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchSession({ page: pageNumber, search: searchTerm }));
    };

    const confirmDelete = async () => {
        if (deleteTaskId) {
            await dispatch(deleteSession(deleteTaskId));
            setShowModalDelete(false);
            // Recharger la liste actuelle après suppression
            dispatch(fetchSession({ page: pagination?.currentPage || 1, search: searchTerm }));
        }
    };

    return (
        <>
            <Navbar />

            <main className="main-wrapper">
                <div className="main-content py-4 px-3 px-md-4">

                    {/* En-tête de la page */}
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">

                        <div className="d-flex align-items-center">
                            <div className="icon-box bg-white text-primary shadow-sm me-3">
                                <FiFileText size={24} />
                            </div>
                            <div>
                                <h2 className="fw-bolder mb-0 text-main">Liste des Sessions</h2>
                                <p className="text-muted mb-0 small">Gérez et consultez vos sessions enregistrées</p>
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3">
                            {/* Nouvelle Barre de recherche */}
                            <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', minWidth: '250px' }}>
                                <span className="input-group-text bg-white border-0 text-muted px-3">
                                    <FiSearch size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 ps-0 shadow-none bg-white"
                                    placeholder="Rechercher une session..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Bouton pour ajouter un nouveau rapport */}
                            <NavLink to="/session" className="btn btn-primary d-flex align-items-center justify-content-center shadow-sm" style={{ borderRadius: '12px', padding: '10px 20px', whiteSpace: 'nowrap' }}>
                                <FiPlus className="me-2" />
                                Nouveau
                            </NavLink>
                        </div>
                    </div>

                    {/* Carte principale contenant le tableau */}
                    <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-0">

                            {loading && (!sessions || sessions.length === 0) ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                    <MutatingDots height="80" width="80" color="#4318FF" visible={true} />
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table modern-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Libellé Session</th>
                                                <th>Entrées (Rapports)</th>
                                                <th>Sorties (Dépenses)</th>
                                                <th>Montant Net</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(sessions) && sessions.length > 0 ? (
                                                sessions.map((session) => {
                                                    // 💡 1. LE CALCUL DU MONTANT NET AU FRONTEND
                                                    // On utilise || 0 pour éviter les erreurs si les valeurs sont nulles
                                                    const totalRapports = session.total_montants || 0;
                                                    const totalDepenses = session.total_depenses || 0;
                                                    const montantNet = totalRapports - totalDepenses;

                                                    return (
                                                        <tr key={session.id} className="align-middle">
                                                            {/* Libellé */}
                                                            <td className="fw-bold text-main">{session.libelle}</td>

                                                            {/* Total Rapports (en bleu/primaire) */}
                                                            <td className="text-primary fw-bolder font-monospace">
                                                                {totalRapports.toLocaleString()} FCFA
                                                            </td>

                                                            {/* Total Dépenses (en rouge) */}
                                                            <td className="text-danger fw-bolder font-monospace">
                                                                {totalDepenses.toLocaleString()} FCFA
                                                            </td>

                                                            {/* 💡 2. AFFICHAGE DU MONTANT NET (Vert si positif, Rouge si négatif) */}
                                                            <td className={`fw-bolder font-monospace ${montantNet >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                {montantNet > 0 ? '+' : ''}{montantNet.toLocaleString()} FCFA
                                                            </td>

                                                            {/* Actions */}
                                                            <td className="text-center">
                                                                <button
                                                                    className="btn btn-action btn-light-danger"
                                                                    title="Supprimer"
                                                                    onClick={() => {
                                                                        setDeleteTaskId(session.id);
                                                                        setDeleteTacheName(session.libelle);
                                                                        setShowModalDelete(true);
                                                                    }}
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-5 text-muted">
                                                        {searchTerm !== ''
                                                            ? `Aucune session trouvée pour "${searchTerm}".`
                                                            : "Aucune session trouvée."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination moderne */}
                            {!loading && pagination && pagination.lastPage > 1 && (
                                <div className="p-4 border-top">
                                    <nav className="d-flex justify-content-center">
                                        <ul className="pagination modern-pagination mb-0">
                                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)}>Précédent</button>
                                            </li>
                                            {[...Array(pagination.lastPage)].map((_, i) => (
                                                <li key={i} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${pagination.currentPage === pagination.lastPage ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(pagination.currentPage + 1)}>Suivant</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main >

            {/* MODAL DE SUPPRESSION (Design Soft UI) */}
            {
                showModalDelete && (
                    <>
                        <div className="modal-backdrop fade show modern-backdrop"></div>
                        <div className="modal fade show d-block" tabIndex={-1}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                                    <div className="modal-body p-4 p-md-5 text-center">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                                            <FiAlertCircle size={40} />
                                        </div>
                                        <h4 className="fw-bolder text-main mb-3">Confirmer la suppression</h4>
                                        <p className="text-muted mb-4">
                                            Voulez-vous vraiment supprimer cette session  <strong className="text-dark">{deleteTacheName}</strong> ? Cette action est irréversible.
                                        </p>
                                        <div className="d-flex justify-content-center gap-3">
                                            <button className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }} onClick={() => setShowModalDelete(false)}>Annuler</button>
                                            <button className="btn btn-danger fw-bold px-4 py-2" style={{ borderRadius: '10px' }} onClick={confirmDelete}>Oui, supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            {/* ===== STYLES CSS POUR LE DASHBOARD ET LE TABLEAU ===== */}
            <style>{`
                .text-main { color: #2b3674; }
                
                .main-wrapper {
                    margin-left: 280px; 
                    background-color: #f4f7fe;
                    min-height: 100vh;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1023px) {
                    .main-wrapper {
                        margin-left: 0;
                        padding-top: 70px; 
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

                .modern-table {
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .modern-table thead th {
                    background-color: #f8f9fa;
                    color: #a3aed1;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                    padding: 18px 24px;
                    border-bottom: 1px solid #e9ecef;
                    border-top: none;
                }

                .modern-table tbody td {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f4f7fe;
                    color: #475467;
                }

                .modern-table tbody tr:hover td {
                    background-color: #f8f9fa;
                }

                .modern-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .btn-action {
                    width: 35px;
                    height: 35px;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: none;
                    transition: all 0.2s;
                }

                .btn-light-danger {
                    background-color: #fee4e2;
                    color: #d92d20;
                }

                .btn-light-danger:hover {
                    background-color: #fec3c0;
                    color: #b42318;
                }

                .modern-pagination .page-link {
                    border: none;
                    color: #475467;
                    margin: 0 4px;
                    border-radius: 8px;
                    font-weight: 600;
                    padding: 8px 16px;
                }

                .modern-pagination .page-item.active .page-link {
                    background-color: #4318FF;
                    color: white;
                    box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
                }

                .modern-pagination .page-link:hover:not(.active) {
                    background-color: #f4f7fe;
                }

                .modern-backdrop {
                    background-color: rgba(11, 20, 55, 0.6);
                    backdrop-filter: blur(4px);
                }
                
                /* Style pour enlever la bordure bleue autour de l'input quand on clique */
                .form-control:focus {
                    box-shadow: none;
                }
            `}</style>
        </>
    );
}