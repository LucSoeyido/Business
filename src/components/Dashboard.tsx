import Navbar from "./Navbar";
import Header from "./Header";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar, FiActivity } from "react-icons/fi";
import { MutatingDots } from 'react-loader-spinner';

// Importation des composants de Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  entrees: number;
}

interface DashboardStats {
  session_active: string;
  total_session: number;
  total_depenses: number;
  montant_net_session: number;
  total_mois: number;
  chart_data: ChartData[];
  annees_disponibles: number[];
  annee_selectionnee: number;
   // 👈 Ajout des données du graphique
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/dashboard-stats?year=${selectedYear}`);
        setStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  },[selectedYear]);

  // Personnalisation de l'info-bulle du graphique au survol
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip shadow-lg" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: 'none' }}>
          <p className="fw-bold mb-1" style={{ color: '#2b3674' }}>{label}</p>
          <p className="text-primary fw-bolder mb-0" style={{ fontSize: '16px' }}>
            {payload[0].value.toLocaleString()} FCFA
          </p>
        </div>
      );
    }
    return null;
  };
  // Formateur pour raccourcir les grands nombres sur l'axe Y
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <>
      <Navbar />

      <main className="main-wrapper" style={{ backgroundColor: '#f4f7fe' }}>
        <div className="main-content py-3 px-3 px-md-4">
          <Header />

          <div className="mb-4 d-flex align-items-center">
            <div className="icon-box bg-white text-primary shadow-sm me-3" style={{ width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiActivity size={24} />
            </div>
            <div>
              <h2 className="fw-bolder mb-0" style={{ color: '#2b3674' }}>Vue d'ensemble</h2>
              <p className="text-muted mb-0">
                Session en cours : <strong className="text-primary">{stats?.session_active || 'Chargement...'}</strong>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <MutatingDots height="80" width="80" color="#4318FF" visible={true} />
            </div>
          ) : stats ? (
            <>
              {/* Les 4 cartes de statistiques */}
              {/* Les 4 cartes de statistiques : 2 par ligne (col-md-6) */}
              <div className="row g-4 mb-4">

                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="icon-box bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '60px', height: '60px' }}>
                        <FiTrendingUp size={28} />
                      </div>
                      <div>
                        <p className="text-muted mb-1 fw-bold" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Entrées (Session)</p>
                        <h4 className="fw-bolder mb-0" style={{ color: '#2b3674' }}>
                          {stats.total_session.toLocaleString()} <span className="fs-6 text-muted">FCFA</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="icon-box bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '60px', height: '60px' }}>
                        <FiTrendingDown size={28} />
                      </div>
                      <div>
                        <p className="text-muted mb-1 fw-bold" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Dépenses (Session)</p>
                        <h4 className="fw-bolder mb-0" style={{ color: '#2b3674' }}>
                          {stats.total_depenses.toLocaleString()} <span className="fs-6 text-muted">FCFA</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '60px', height: '60px' }}>
                        <FiDollarSign size={28} />
                      </div>
                      <div>
                        <p className="text-muted mb-1 fw-bold" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Net (Session)</p>
                        <h4 className={`fw-bolder mb-0 ${stats.montant_net_session >= 0 ? 'text-success' : 'text-danger'}`}>
                          {stats.montant_net_session > 0 ? '+' : ''}{stats.montant_net_session.toLocaleString()} <span className="fs-6 text-muted">FCFA</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 d-flex align-items-center">
                      <div className="icon-box bg-warning bg-opacity-10 text-warning rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '60px', height: '60px' }}>
                        <FiCalendar size={28} />
                      </div>
                      <div>
                        <p className="text-muted mb-1 fw-bold" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Total Encaissé (Mois)</p>
                        <h4 className="fw-bolder mb-0" style={{ color: '#2b3674' }}>
                          {stats.total_mois.toLocaleString()} <span className="fs-6 text-muted">FCFA</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ===== SECTION GRAPHIQUE ===== */}
              <div className="card border-0 shadow-sm w-100" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4 p-md-5">
                 {/* En-tête du graphique avec le Select */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bolder m-0" style={{ color: '#2b3674' }}>Évolution des entrées</h4>
                                        
                                        {/* Le Select stylisé qui remplace l'ancien badge statique */}
                                        <select 
                                            className="form-select border-0 text-primary fw-bold shadow-sm" 
                                            style={{ 
                                                width: 'auto', 
                                                backgroundColor: '#f4f7fe', 
                                                borderRadius: '12px', 
                                                cursor: 'pointer',
                                                padding: '8px 36px 8px 16px' // Ajustement du padding
                                            }}
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        >
                                            {stats.annees_disponibles?.map((annee) => (
                                                <option key={annee} value={annee}>
                                                    Année {annee}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      {/* Correction de la marge gauche (left: 10 au lieu de -20) */}
                      <LineChart data={stats.chart_data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#a0aec0', fontSize: 13, fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#a0aec0', fontSize: 13 }}
                          tickFormatter={formatYAxis} /* 👈 Application du formateur */
                          width={50} /* 👈 On donne assez d'espace pour le texte */
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent', stroke: '#e9ecef', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Line
                          type="monotone"
                          dataKey="entrees"
                          stroke="#4318FF"
                          strokeWidth={4}
                          dot={{ fill: '#4318FF', stroke: '#fff', strokeWidth: 3, r: 6 }}
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#4318FF' }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-danger shadow-sm border-0" style={{ borderRadius: '15px' }}>
              Impossible de charger les statistiques.
            </div>
          )}

        </div>
      </main>

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
            `}</style>
    </>
  );
}