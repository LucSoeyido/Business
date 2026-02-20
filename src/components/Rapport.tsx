import Navbar from "./Navbar";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Rapport() {

    interface FormContr {
        libelle: string,
        dateDemarrage: Date,
        montant: number | null

    }

    const [formData, setFormData] = useState<FormContr>({
        libelle: '',
        dateDemarrage: new Date(),
        montant: null

    })
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Données sauvégardées:', formData)

    }


    return (
        <>
            <Navbar />


            <main className="nxl-container bg-black" style={{ backgroundColor: 'black', top: '0' }}>



                <div className="main-content py-4">
                    <div className="container-fluid px-3 px-md-5">

                        <div className="row">
                            <div className="col-12">

                                <div className="card shadow w-100">
                                    <div className="card-body p-3 p-md-5">

                                        <h2 className="mb-4 text-center">Créer un nouveau rapport</h2>

                                        <form onSubmit={handleSubmit}>

                                            {/* Libellé */}
                                            <div className="mb-3">

                                                <select

                                                    className="form-control"

                                                    onChange={(e) =>
                                                        setFormData({ ...formData, libelle: e.target.value })
                                                    }
                                                    required
                                                >
                                                    <option value="" disabled selected>Choisir un partenaire</option>
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
                                                    <option value="Tassi justine">Tassi justine</option>
                                                    <option value="Autres">Autres</option>

                                                </select>

                                            </div>

                                            <div className="row">
                                                {/* Date démarrage */}
                                                <div className="col-12 col-md-12 mb-3">
                                                    <label className="form-label" style={{ padding: '10px' }}>
                                                        Date du rapport
                                                    </label>
                                                    <DatePicker
                                                        selected={formData.dateDemarrage}
                                                        onChange={(date) =>
                                                            setFormData({ ...formData, dateDemarrage: date })
                                                        }
                                                        className="form-control"
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                </div>

                                                {/* Date clôture */}
                                                <div className="col-12 col-md-12 mb-3">
                                                    <label className="form-label" style={{ padding: '10px' }}>
                                                        Montant
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.montant}

                                                        onChange={(e) =>
                                                            setFormData({ ...formData, montant: parseFloat(e.target.value) })
                                                         }
                                                        className="form-control"

                                                    />
                                                </div>
                                            </div>

                                            <button className="btn btn-primary w-100 mt-3">
                                                Enregistrer
                                            </button>

                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>


            </main>

        </>

    );
}