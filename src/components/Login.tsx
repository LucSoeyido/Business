import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { MutatingDots } from 'react-loader-spinner';

export default function Login() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password
            });

            const { access_token, user } = response.data;
            
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            navigate('/');
            
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError('Email ou mot de passe incorrect.');
            } else {
                setError('Une erreur est survenue lors de la connexion.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // 💡 Utilisation d'un wrapper Flexbox strict au lieu des classes "container" et "row"
        <div 
            className="d-flex align-items-center justify-content-center" 
            style={{ 
                minHeight: '100vh', 
                width: '100vw', 
                backgroundColor: '#f4f7fe', 
                margin: 0, 
                padding: '20px',
                position: 'fixed', // Force la page à prendre tout l'écran, sans scroll
                top: 0,
                left: 0
            }}
        >
            {/* 💡 On fixe une largeur max (450px) pour que la carte soit parfaite sur ordinateur */}
            <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '450px', borderRadius: '24px' }}>
                <div className="card-body p-4 p-md-5">
                    
                    <div className="text-center mb-4">
                        <h2 className="fw-bolder" style={{ color: '#2b3674', letterSpacing: '-1px' }}>
                            Lucky Business
                        </h2>
                        <p className="text-muted">Connectez-vous pour accéder à votre espace.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 rounded-3 shadow-sm mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                Adresse Email
                            </label>
                            <div className="input-group shadow-sm" style={{ borderRadius: '12px' }}>
                                <span className="input-group-text bg-white border-0" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                    <FiMail className="text-muted" />
                                </span>
                                <input 
                                    type="email" 
                                    className="form-control form-control-lg bg-white border-0" 
                                    placeholder="admin@lucky-dev.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px', fontSize: '15px' }}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label fw-bold" style={{ color: '#2b3674' }}>
                                Mot de passe
                            </label>
                            <div className="input-group shadow-sm" style={{ borderRadius: '12px' }}>
                                <span className="input-group-text bg-white border-0" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                    <FiLock className="text-muted" />
                                </span>
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg bg-white border-0" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px', fontSize: '15px' }}
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-100 shadow-sm d-flex justify-content-center align-items-center"
                            style={{ borderRadius: '12px', padding: '14px 0', fontWeight: '600' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <MutatingDots height="30" width="30" color="#ffffff" secondaryColor="#ffffff" visible={true} />
                            ) : (
                                <>
                                    <FiLogIn className="me-2" size={20} />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                    
                </div>
            </div>

            <style>{`
                /* Désactive le contour bleu de base de Bootstrap */
                .form-control:focus {
                    box-shadow: none;
                    background-color: #f8f9fa !important;
                }
                .input-group-text {
                    padding-left: 20px;
                }
                /* On s'assure que le body ne crée pas de scroll horizontal */
                body {
                    overflow-x: hidden;
                }
            `}</style>
        </div>
    );
}