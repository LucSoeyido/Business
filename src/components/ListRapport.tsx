import Navbar from "./Navbar";
import { fetchRapports, deleteRapport } from "../redux/slices/rapportSlice";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { MutatingDots } from 'react-loader-spinner';
import { NavLink } from "react-router-dom";

// Ajout d'icônes modernes
import { FiTrash2, FiFileText, FiPlus, FiAlertCircle, FiSearch, FiCalendar, FiDollarSign } from "react-icons/fi";

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

export default function ListRapport() {
    const dispatch = useAppDispatch();

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
    const [deleteTacheName, setDeleteTacheName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { rapports, loading, pagination } = useAppSelector((state) => state.rapport);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchRapports({ page: 1, search: searchTerm }));
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchRapports({ page: pageNumber, search: searchTerm }));
    };

    const confirmDelete = async () => {
        if (deleteTaskId) {
            await dispatch(deleteRapport(deleteTaskId));
            setShowModalDelete(false);
            dispatch(fetchRapports({ page: pagination.currentPage, search: searchTerm }));
        }
    };

    return (
        <>
            <Navbar />

            <main className="main-wrapper">
                <div className="main-content py-4 px-3 px-md-4">
                    
                    {/* En-tête de la page */}
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
                        <div className="d-flex align-items-center w-100">
                            <div className="icon-box bg-white text-primary shadow-sm me-3 flex-shrink-0">
                                <FiFileText size={24} />
                            </div>
                            <div className="flex-grow-1 text-truncate">
                                <h2 className="fw-bolder mb-0 text-main text-truncate">Liste des Rapports</h2>
                                <p className="text-muted mb-0 small text-truncate">Gérez et consultez vos rapports</p>
                            </div>
                        </div>
                        
                        {/* Zone de recherche et bouton d'ajout */}
                        <div className="d-flex flex-row gap-2 action-container w-100 justify-content-lg-end">
                            <div className="input-group shadow-sm flex-grow-1" style={{ borderRadius: '12px', overflow: 'hidden', maxWidth: '400px' }}>
                                <span className="input-group-text bg-white border-0 text-muted px-3">
                                    <FiSearch size={18} />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-0 ps-0 shadow-none bg-white search-input" 
                                    placeholder="Rechercher..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <NavLink to="/rapport" className="btn btn-primary btn-nouveau d-flex align-items-center justify-content-center shadow-sm flex-shrink-0">
                                <FiPlus className="icon-plus" />
                                <span className="btn-nouveau-label ms-2">Nouveau</span>
                            </NavLink>
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
                                    {Array.isArray(rapports) && rapports.length > 0 ? (
                                        <>
                                            {/* ===== VERSION BUREAU (TABLEAU) ===== */}
                                            <div className="d-none d-md-block table-responsive">
                                                <table className="table modern-table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Session</th>
                                                            <th>Partenaire (Libellé)</th>
                                                            <th>Montant</th>
                                                            <th>Date</th>
                                                            <th className="text-center">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rapports.map((r) => (
                                                            <tr key={r.id} className="align-middle">
                                                                <td className="fw-semibold text-main">
                                                                    <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                                                        {r.session?.libelle || 'N/A'}
                                                                    </span>
                                                                </td>
                                                                <td className="fw-bold text-main">{r.libelle}</td>
                                                                <td className="text-success fw-bolder font-monospace">
                                                                    {r.montant ? `${r.montant.toLocaleString()} FCFA` : '-'}
                                                                </td>
                                                                <td className="text-muted">{r.created_at ? r.created_at.substring(0, 10) : ''}</td>
                                                                <td className="text-center">
                                                                    <button
                                                                        className="btn btn-action btn-light-danger"
                                                                        title="Supprimer"
                                                                        onClick={() => {
                                                                            setDeleteTaskId(r.id);
                                                                            setDeleteTacheName(r.libelle);
                                                                            setShowModalDelete(true);
                                                                        }}
                                                                    >
                                                                        <FiTrash2 />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* ===== VERSION MOBILE (CARTES) ===== */}
                                            <div className="d-block d-md-none p-3 bg-light">
                                                {rapports.map((r) => (
                                                    <div key={r.id} className="card border-0 shadow-sm mb-3 mobile-card">
                                                        <div className="card-body p-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                                                                <span className="badge bg-primary bg-opacity-10 text-black px-3 py-2 rounded-pill text-truncate" style={{ fontSize: '12px', maxWidth: '70%' }}>
                                                                    {r.session?.libelle || 'N/A'}
                                                                </span>
                                                                <button
                                                                    className="btn btn-action btn-light-danger flex-shrink-0"
                                                                    style={{ width: '42px', height: '42px' }}
                                                                    onClick={() => {
                                                                        setDeleteTaskId(r.id);
                                                                        setDeleteTacheName(r.libelle);
                                                                        setShowModalDelete(true);
                                                                    }}
                                                                >
                                                                    <FiTrash2 size={16} />
                                                                </button>
                                                            </div>

                                                            <h5 className="fw-bold text-main mb-3 prevent-overflow">{r.libelle}</h5>

                                                            <div className="d-flex justify-content-between align-items-end p-2 rounded-3 bg-white border">
                                                                <div className="pe-2">
                                                                    <small className="text-muted d-block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                                                                        <FiDollarSign className="me-1" />Montant
                                                                    </small>
                                                                    <span className="text-success fw-bolder font-monospace prevent-overflow d-block" style={{ fontSize: '15px' }}>
                                                                        {r.montant ? `${r.montant.toLocaleString()} FCFA` : '-'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-end ps-2 border-start">
                                                                    <small className="text-muted d-block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                                                                        <FiCalendar className="me-1" />Date
                                                                    </small>
                                                                    <span className="text-muted fw-bold d-block" style={{ fontSize: '14px' }}>
                                                                        {r.created_at ? r.created_at.substring(0, 10) : ''}
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
                                                ? `Aucun rapport trouvé pour "${searchTerm}".` 
                                                : "Aucun rapport trouvé."}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Pagination Dynamique */}
                            {!loading && pagination && pagination.lastPage > 1 && (
                                <div className="p-4 bg-white border-top">
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
                                        Voulez-vous vraiment supprimer le rapport de <strong className="text-dark">{deleteTacheName}</strong> ?
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

                .btn-action { display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: none; transition: all 0.2s; }
                .btn-light-danger { background-color: #fee4e2; color: #d92d20; }
                .btn-light-danger:hover { background-color: #fec3c0; color: #b42318; }

                .modern-pagination { gap: 4px; }
                .modern-pagination .page-link { border: none; color: #475467; border-radius: 8px; font-weight: 600; padding: 8px 16px; transition: all 0.2s; }
                .modern-pagination .page-item.active .page-link { background-color: #4318FF; color: white; box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2); }
                .modern-pagination .page-link:hover:not(.active):not(.bg-transparent) { background-color: #f4f7fe; }
                .modern-backdrop { background-color: rgba(11, 20, 55, 0.6); backdrop-filter: blur(4px); }
                .form-control:focus { box-shadow: none; }
            `}</style>
        </>
    );
}