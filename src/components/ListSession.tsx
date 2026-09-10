import Navbar from "./Navbar";
import { fetchSession, deleteSession } from "../redux/slices/sessionSlice";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { MutatingDots } from 'react-loader-spinner';
import { NavLink } from "react-router-dom";

import { FiTrash2, FiFileText, FiPlus, FiAlertCircle, FiSearch, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// Fonction pour gérer la logique des points de suspension dans la pagination
const getPageNumbers = (currentPage: number, lastPage: number): (number | string)[] => {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', lastPage];
    }

    if (currentPage >= lastPage - 3) {
        return [1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
};

 // 💡 1. RÉCUPÉRATION DE L'UTILISATEUR
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAdministrateur = currentUser?.role === 'administrateur';
  const isSecretaire = currentUser?.role === 'secretaire';


export default function ListSession() {
    const dispatch = useAppDispatch();

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
    const [deleteTacheName, setDeleteTacheName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { sessions, loading, pagination } = useAppSelector((state) => state.session);

    // 💡 Si l'utilisateur est secrétaire, il ne doit voir que le dernier rapport (session la plus récente)
    const sessionsToDisplay = isSecretaire && Array.isArray(sessions) && sessions.length > 0
        ? [sessions[0]]
        : sessions;

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchSession({ page: 1, search: searchTerm }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchSession({ page: pageNumber, search: searchTerm }));
    };

    const confirmDelete = async () => {
        if (!isAdministrateur) {
            setShowModalDelete(false);
            return;
        }
        if (deleteTaskId) {
            await dispatch(deleteSession(deleteTaskId));
            setShowModalDelete(false);
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

                        <div className="d-flex flex-row gap-2 action-container w-100 justify-content-lg-end">
                            <div className="input-group shadow-sm flex-grow-1" style={{ borderRadius: '12px', overflow: 'hidden', maxWidth: '400px' }}>
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

                            <NavLink to="/session" className="btn btn-primary btn-nouveau d-flex align-items-center justify-content-center shadow-sm flex-shrink-0">
                                <FiPlus className="icon-plus" />
                                <span className="btn-nouveau-label ms-2">Nouveau</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-0">

                            {loading && (!sessions || sessions.length === 0) ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                    <MutatingDots height="80" width="80" color="#4318FF" visible={true} />
                                </div>
                            ) : (
                                <>
                                    {/* ===== VUE TABLEAU (desktop uniquement) ===== */}
                                    <div className="d-none d-md-block table-responsive">
                                        <table className="table modern-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Libellé Session</th>
                                                    <th>Entrées (Rapports)</th>
                                                    <th>Sorties (Dépenses)</th>
                                                    <th>Montant Net</th>
                                                    {isAdministrateur && (
                                                        <th className="text-center">Action</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(sessionsToDisplay) && sessionsToDisplay.length > 0 ? (
                                                    sessionsToDisplay.map((session) => {
                                                        const totalRapports = session.total_montants || 0;
                                                        const totalDepenses = session.total_depenses || 0;
                                                        const montantNet = totalRapports - totalDepenses;

                                                        return (
                                                            <tr key={session.id} className="align-middle">
                                                                <td className="fw-bold text-main">{session.libelle}</td>
                                                                <td className="text-primary fw-bolder font-monospace">
                                                                    {totalRapports.toLocaleString()} FCFA
                                                                </td>
                                                                <td className="text-danger fw-bolder font-monospace">
                                                                    {totalDepenses.toLocaleString()} FCFA
                                                                </td>
                                                                <td className={`fw-bolder font-monospace ${montantNet >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                    {montantNet > 0 ? '+' : ''}{montantNet.toLocaleString()} FCFA
                                                                </td>
                                                                {isAdministrateur && (
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
                                                                )}
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={isAdministrateur ? 5 : 4} className="text-center py-5 text-muted">
                                                            {searchTerm !== ''
                                                                ? `Aucune session trouvée pour "${searchTerm}".`
                                                                : "Aucune session trouvée."}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ===== VUE CARDS (mobile uniquement) ===== */}
                                    <div className="d-block d-md-none">
                                        {Array.isArray(sessionsToDisplay) && sessionsToDisplay.length > 0 ? (
                                            <div className="p-3 d-flex flex-column gap-3">
                                                {sessionsToDisplay.map((session) => {
                                                    const totalRapports = session.total_montants || 0;
                                                    const totalDepenses = session.total_depenses || 0;
                                                    const montantNet = totalRapports - totalDepenses;

                                                    return (
                                                        <div key={session.id} className="session-card">
                                                            {/* Header de la card */}
                                                            <div className="session-card-header">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="session-card-icon">
                                                                        <FiFileText size={16} />
                                                                    </div>
                                                                    <span className="fw-bold text-main session-card-title">{session.libelle}</span>
                                                                </div>
                                                                {isAdministrateur && (
                                                                    <button
                                                                        className="btn btn-action btn-light-danger"
                                                                        title="Supprimer"
                                                                        onClick={() => {
                                                                            setDeleteTaskId(session.id);
                                                                            setDeleteTacheName(session.libelle);
                                                                            setShowModalDelete(true);
                                                                        }}
                                                                    >
                                                                        <FiTrash2 size={15} />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Métriques de la card */}
                                                            <div className="session-card-body">
                                                                <div className="session-metric">
                                                                    <div className="session-metric-label">
                                                                        <FiTrendingUp size={13} className="me-1 text-primary" />
                                                                        Entrées
                                                                    </div>
                                                                    <span className="session-metric-value text-primary">
                                                                        {totalRapports.toLocaleString()} FCFA
                                                                    </span>
                                                                </div>

                                                                <div className="session-metric-divider" />

                                                                <div className="session-metric">
                                                                    <div className="session-metric-label">
                                                                        <FiTrendingDown size={13} className="me-1 text-danger" />
                                                                        Sorties
                                                                    </div>
                                                                    <span className="session-metric-value text-danger">
                                                                        {totalDepenses.toLocaleString()} FCFA
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Footer : Montant net */}
                                                            <div className={`session-card-footer ${montantNet >= 0 ? 'net-positive' : 'net-negative'}`}>
                                                                <span className="session-net-label">Montant Net</span>
                                                                <span className="session-net-value">
                                                                    {montantNet > 0 ? '+' : ''}{montantNet.toLocaleString()} FCFA
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-muted px-3">
                                                {searchTerm !== ''
                                                    ? `Aucune session trouvée pour "${searchTerm}".`
                                                    : "Aucune session trouvée."}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Pagination Dynamique (partagée desktop + mobile) */}
                            {!loading && !isSecretaire && pagination && pagination.lastPage > 1 && (
                                <div className="p-4 border-top">
                                    <nav className="d-flex justify-content-center">
                                        <ul className="pagination modern-pagination mb-0 flex-wrap justify-content-center">
                                            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)}>Précédent</button>
                                            </li>
                                            
                                            {getPageNumbers(pagination.currentPage, pagination.lastPage).map((page, index) => (
                                                <li key={index} className={`page-item ${pagination.currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                                    {page === '...' ? (
                                                        <span className="page-link bg-transparent border-0 text-muted px-2">...</span>
                                                    ) : (
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    )}
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
            </main>

            {/* MODAL DE SUPPRESSION */}
            {showModalDelete && (
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
                                        Voulez-vous vraiment supprimer cette session <strong className="text-dark">{deleteTacheName}</strong> ? Cette action est irréversible.
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
            )}

            <style>{`
                /* ... Les styles CSS existants restent inchangés ... */
                .text-main { color: #2b3674; }

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

                    .input-group {
                        min-width: unset !important;
                        width: 100% !important;
                    }

                    .modern-pagination {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }

                .btn-nouveau {
                    border-radius: 12px;
                    padding: 10px 20px;
                    font-weight: 600;
                    white-space: nowrap;
                }

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

                .icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ===== TABLEAU ===== */
                .modern-table { border-collapse: separate; border-spacing: 0; }
                .modern-table thead th { background-color: #f8f9fa; color: #a3aed1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; padding: 18px 24px; border-bottom: 1px solid #e9ecef; border-top: none; }
                .modern-table tbody td { padding: 16px 24px; border-bottom: 1px solid #f4f7fe; color: #475467; }
                .modern-table tbody tr:hover td { background-color: #f8f9fa; }
                .modern-table tbody tr:last-child td { border-bottom: none; }

                /* ===== CARDS MOBILE ===== */
                .session-card { background: #ffffff; border-radius: 16px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 2px 8px rgba(43, 54, 116, 0.06); }
                .session-card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f4f7fe; background-color: #fafbff; }
                .session-card-icon { width: 30px; height: 30px; border-radius: 8px; background-color: #ede9ff; color: #4318FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .session-card-title { font-size: 14px; color: #2b3674; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
                .session-card-body { display: flex; align-items: stretch; padding: 14px 16px; gap: 0; }
                .session-metric { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .session-metric-divider { width: 1px; background-color: #f0f0f5; margin: 0 16px; }
                .session-metric-label { font-size: 11px; color: #a3aed1; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: flex; align-items: center; }
                .session-metric-value { font-size: 13px; font-weight: 700; font-family: monospace; }
                .session-card-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #f4f7fe; }
                .session-card-footer.net-positive { background-color: #f0fdf4; }
                .session-card-footer.net-negative { background-color: #fff5f5; }
                .session-net-label { font-size: 12px; font-weight: 600; color: #475467; text-transform: uppercase; letter-spacing: 0.5px; }
                .session-net-value { font-size: 14px; font-weight: 800; font-family: monospace; }
                .net-positive .session-net-value { color: #15803d; }
                .net-negative .session-net-value { color: #d92d20; }

                /* ===== BOUTONS ===== */
                .btn-action { width: 35px; height: 35px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: none; transition: all 0.2s; flex-shrink: 0; }
                .btn-light-danger { background-color: #fee4e2; color: #d92d20; }
                .btn-light-danger:hover { background-color: #fec3c0; color: #b42318; }

                /* ===== PAGINATION ===== */
                .modern-pagination { gap: 4px; }
                .modern-pagination .page-link { border: none; color: #475467; border-radius: 8px; font-weight: 600; padding: 8px 16px; transition: all 0.2s;}
                .modern-pagination .page-item.active .page-link { background-color: #4318FF; color: white; box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2); }
                .modern-pagination .page-link:hover:not(.active):not(.bg-transparent) { background-color: #f4f7fe; }
                .modern-backdrop { background-color: rgba(11, 20, 55, 0.6); backdrop-filter: blur(4px); }
                .form-control:focus { box-shadow: none; }
            `}</style>
        </>
    );
}