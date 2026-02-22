import Navbar from "./Navbar";
import { fetchRapports, deleteRapport } from "../redux/slices/rapportSlice";
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Audio } from 'react-loader-spinner'

export default function ListRapport() {
    const dispatch = useAppDispatch();
    const { rapports, loading } = useAppSelector((state) => state.rapport);

    useEffect(() => {
        dispatch(fetchRapports());
    }, [dispatch]);

    return (
        <div className="d-flex bg" style={{ paddingLeft: '17vw' }}>

            {/* 1. Navbar (Sidebar) */}
            <Navbar />

            {/* 2. Main Content : On enlève le padding fixe et on utilise flex-grow-1 */}
            <main className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                <div className="main-content py-4 flex-grow-1">

                    {/* px-2 sur mobile pour gagner de la place, px-md-5 sur desktop */}
                    <div className="container-fluid px-2 px-md-5">

                        <div className="row g-0">
                            <div className="col-12">
                                {loading ?
                                    <Audio
                                        height="80"
                                        width="80"
                                        color="#4fa94d"
                                        ariaLabel="audio-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="wrapper-class"
                                        visible={true}
                                    />

                                    : <>  <h2 className="mb-4 text-center text-black">Liste des rapports</h2>

                                        {/* 3. Table Responsive : Crucial pour mobile */}
                                        <div className="table-responsive shadow-lg rounded">
                                            <table className="table table-bordered table-dark m-0">
                                                <thead>
                                                    <tr className="text-nowrap">
                                                        <th style={{ color: 'white' }} className="py-3 px-4 text-white" scope="col">Session</th>
                                                        <th style={{ color: 'white' }} className="py-3 px-4 text-white" scope="col">Libellé</th>
                                                        <th style={{ color: 'white' }} className="py-3 px-4 text-white" scope="col">Montant</th>
                                                        <th style={{ color: 'white' }} className="py-3 px-4 text-white" scope="col">Date</th>
                                                        <th style={{ color: 'white' }} className="py-3 px-4 text-white" scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {rapports.map((r) => (
                                                        <tr key={r.id} className="text-nowrap">
                                                            <td style={{ color: 'white' }} className="py-3 px-4">{r.session?.libelle || 'N/A'}</td>
                                                            <td style={{ color: 'white' }} className="py-3 px-4">{r.libelle}</td>
                                                            <td style={{ color: 'white' }} className="py-3 px-4 font-monospace">{r.montant}</td>
                                                            <td style={{ color: 'white' }} className="py-3 px-4">{r.created_at}</td>
                                                            <td style={{ color: 'white' }} className="py-3 px-4 text-center">
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => {
                                                                        if (window.confirm("Supprimer ce rapport ?"))
                                                                            dispatch(deleteRapport(r.id))
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash mr-1"></i> Supprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div> </>

                                }





                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}