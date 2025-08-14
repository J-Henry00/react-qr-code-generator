import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MainForm from './components/MainForm.jsx';
import Modal from './components/Modal.jsx';
import DownloadOptions from './components/DownloadOptions.jsx';
import { disableCacheInDev, clearAllCacheOnReload, logCacheStatus } from './utils/devCacheUtils.jsx';
import { generateQrContent, handleDownload, handleCopyUrl } from './utils/qrUtils.jsx';

// POZOR: Tato hodnota je načítána z proměnné prostředí.
const initialUrl = import.meta.env.VITE_INITIAL_QR_URL || 'https://www.google.com';

const App = () => {
    useEffect(() => {
        // DEV cache management
        if (import.meta.env.DEV) {
            disableCacheInDev();
            clearAllCacheOnReload();
            
            // Log cache status po 2 sekundách
            setTimeout(() => {
                logCacheStatus();
            }, 2000);
        }

        // Service Worker registrace pouze v PROD prostředí
        if ('serviceWorker' in navigator && !import.meta.env.DEV) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(err => {
                        console.log('Service Worker registration failed:', err);
                    });
            });
        }
    }, []);

    // Stavy pro celou aplikaci
    const [qrText, setQrText] = useState(initialUrl);
    const [modalQrContent, setModalQrContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [qrType, setQrType] = useState('text');
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false); // Nový stav pro sledování aktivního QR kódu
    const mainQrCodeRef = useRef(null); // Reference na hlavní QR kód
    const modalQrCodeRef = useRef(null); // Reference na QR kód v modálu
    const debounceTimeoutRef = useRef(null);

    // Důležité: Sjednocení stavu pro všechny typy QR kódů
    const [formData, setFormData] = useState({
        wifi: { ssid: '', password: '', encryption: 'WPA/WPA2' },
        email: { to: '', subject: '', body: '' },
        phone: '',
        sms: { number: '', message: '' },
        geo: { latitude: '', longitude: '' },
        event: { title: '', location: '', start: '', end: '' },
        text: initialUrl, // Přidán výchozí stav pro text
    });

    useEffect(() => {
        // Použij správnou referenci podle toho, který QR kód je aktivní
        const activeRef = isModalActive ? modalQrCodeRef : mainQrCodeRef;
        const canvas = activeRef.current?.querySelector('canvas');
        if (canvas) {
            setQrDataUrl(canvas.toDataURL());
        }
    }, [qrText, modalQrContent, isModalActive]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                setIsModalActive(false); // Nastaví hlavní QR kód jako aktivní
                setShowDownloadOptions(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    // Handler pro aktualizaci obsahu hlavního QR kódu
    const handleQrTextChange = (e) => {
        const text = e.target.value;
        setQrText(text);
        setFormData(prev => ({ ...prev, text: text })); // Důležité: Aktualizace sjednoceného stavu
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
        }, 500);
    };

    // Handler pro změnu dat v modálu, spouští generování nového QR obsahu
    const handleModalDataChange = (type, newData) => {
        setFormData(prev => ({
            ...prev,
            [type]: newData
        }));
    };

    // Důležité: Generování obsahu pro QR kód v modálu se nyní provádí automaticky na základě změn stavu
    useEffect(() => {
        const content = generateQrContent(qrType, formData[qrType]);
        setModalQrContent(content);
    }, [qrType, formData]);


    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4 font-inter overflow-y-auto">
            <MainForm
                qrText={qrText}
                qrContent={qrText}
                onQrTextChange={handleQrTextChange}
                onDownloadClick={() => setShowDownloadOptions(true)}
                onModalOpen={() => {
                    setShowModal(true);
                    setIsModalActive(true); // Nastaví modál jako aktivní
                    setQrType('wifi'); // Otevře modál s výchozím typem Wi-Fi
                }}
                qrCodeRef={mainQrCodeRef}
            />

            {showModal && (
                <Modal
                    qrType={qrType}
                    modalQrContent={modalQrContent}
                    showSideMenu={showSideMenu}
                    formData={formData}
                    setQrType={setQrType}
                    onFormDataChange={handleModalDataChange}
                    onClose={() => {
                        setShowModal(false);
                        setIsModalActive(false); // Nastaví hlavní QR kód jako aktivní
                    }}
                    onSideMenuToggle={() => setShowSideMenu(!showSideMenu)}
                    qrCodeRef={modalQrCodeRef}
                    onDownloadClick={() => setShowDownloadOptions(true)}
                    handleBackdropClick={(event) => {
                        if (event.target.id === 'modal-backdrop') {
                            setShowModal(false);
                            setIsModalActive(false); // Nastaví hlavní QR kód jako aktivní
                        }
                    }}
                />
            )}

            {showDownloadOptions && (
                <DownloadOptions
                    onClose={() => setShowDownloadOptions(false)}
                    // Důležité: Volání utilitární funkce s odpovídajícími parametry
                    onDownload={(format) => {
                        const activeRef = isModalActive ? modalQrCodeRef : mainQrCodeRef;
                        handleDownload(format, activeRef.current, isModalActive ? modalQrContent : qrText);
                    }}
                    // Důležité: Volání utilitární funkce
                    onCopyUrl={() => handleCopyUrl(qrDataUrl)}
                />
            )}
        </div>
    );
};

export default App;