import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faEnvelope, faPhone, faSms, faMapMarkerAlt, faCalendarAlt, faLink, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const initialUrl = import.meta.env.VITE_INITIAL_QR_URL || 'https://www.google.com';

const App = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
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

    const [qrText, setQrText] = useState('');
    const [modalQrContent, setModalQrContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [qrType, setQrType] = useState('text');
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const qrCodeRef = useRef(null);
    const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA/WPA2' });
    const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
    const [phoneData, setPhoneData] = useState('');
    const [smsData, setSmsData] = useState({ number: '', message: '' });
    const [geoData, setGeoData] = useState({ latitude: '', longitude: '' });
    const [eventData, setEventData] = useState({ title: '', location: '', start: '', end: '' });
    const [showSideMenu, setShowSideMenu] = useState(false);
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        setQrText(initialUrl);
    }, []);

    useEffect(() => {
        const canvas = qrCodeRef.current?.querySelector('canvas');
        if (canvas) {
            setQrDataUrl(canvas.toDataURL());
        }
    }, [qrText, modalQrContent]);

    // useEffect pro zavírání modálního okna pomocí ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                if (showDownloadOptions) {
                    setShowDownloadOptions(false);
                } else if (showModal) {
                    setShowModal(false);
                }
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [showModal, showDownloadOptions]);

    const handleQrTextChange = (e) => {
        const text = e.target.value;
        setQrText(text);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
        }, 500);
    };

    // NOVÉ: Handler pro zavírání modálního okna při kliknutí na pozadí
    const handleBackdropClick = (event) => {
        // Zkontrolujeme, zda bylo kliknuto přímo na prvek s id="modal-backdrop"
        // a ne na žádný z jeho potomků
        if (event.target.id === 'modal-backdrop') {
            setShowModal(false);
        }
    };

    const generateQrContent = useCallback(() => {
        let content = '';
        switch (qrType) {
            case 'text':
                content = qrText;
                break;
            case 'wifi':
                content = `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
                break;
            case 'email':
                content = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
                break;
            case 'phone':
                content = `tel:${phoneData}`;
                break;
            case 'sms':
                content = `smsto:${smsData.number}:${encodeURIComponent(smsData.message)}`;
                break;
            case 'geo':
                content = `geo:${geoData.latitude},${geoData.longitude}`;
                break;
            case 'event': {
                let startDate = new Date(eventData.start);
                let endDate = new Date(eventData.end);

                let formattedStartDate = '';
                if (!isNaN(startDate.getTime())) {
                    formattedStartDate = startDate.toISOString().replace(/[-:]|\.\d{3}/g, '');
                }

                let formattedEndDate = '';
                if (!isNaN(endDate.getTime())) {
                    formattedEndDate = endDate.toISOString().replace(/[-:]|\.\d{3}/g, '');
                }

                content = `BEGIN:VEVENT\nSUMMARY:${eventData.title}\nLOCATION:${eventData.location}`;
                if (formattedStartDate) {
                    content += `\nDTSTART:${formattedStartDate}`;
                }
                if (formattedEndDate) {
                    content += `\nDTEND:${formattedEndDate}`;
                }
                content += `\nEND:VEVENT`;
                break;
            }
            default:
                content = '';
        }
        setModalQrContent(content);
    }, [qrType, qrText, wifiData, emailData, phoneData, smsData, geoData, eventData]);

    useEffect(() => {
        generateQrContent();
    }, [qrType, wifiData, emailData, phoneData, smsData, geoData, eventData, generateQrContent]);

    const handleDownload = (format) => {
        const canvas = qrCodeRef.current?.querySelector('canvas');
        if (canvas) {
            let filename = 'qrcode';
            if (qrType === 'text') {
                filename = `qrcode_${qrText.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`;
            } else {
                filename = `qrcode_${qrType}`;
            }

            if (format === 'png') {
                canvas.toBlob((blob) => {
                    saveAs(blob, `${filename}.png`);
                });
            } else if (format === 'jpeg') {
                canvas.toBlob((blob) => {
                    saveAs(blob, `${filename}.jpg`);
                }, 'image/jpeg', 0.9);
            } else if (format === 'svg') {
                const svgString = `
                    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#FFFFFF"/>
                        ${Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data)
                            .filter((_, i) => (i + 1) % 4 !== 0)
                            .reduce((acc, val, i) => {
                                if (i % 3 === 0) {
                                    const x = (i / 3) % canvas.width;
                                    const y = Math.floor((i / 3) / canvas.width);
                                    if (val === 0) {
                                        acc.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#000000"/>`);
                                    }
                                }
                                return acc;
                            }, []).join('')}
                    </svg>
                `;
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                saveAs(blob, `${filename}.svg`);
            }
        }
        setShowDownloadOptions(false);
    };

    const handleCopyUrl = () => {
        if (qrDataUrl) {
            const textarea = document.createElement('textarea');
            textarea.value = qrDataUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('URL zkopírována do schránky!');
        }
        setShowDownloadOptions(false);
    };

    const renderModalContent = () => {
        switch (qrType) {
            case 'text':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Text / URL</h3>
                        <div>
                            <label htmlFor="modalQrText" className="block text-sm font-medium text-gray-700">Obsah QR kódu:</label>
                            <textarea
                                id="modalQrText"
                                rows="5"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={qrText}
                                onChange={handleQrTextChange}
                                placeholder="Zde napište zprávu nebo vložte URL odkaz."
                            ></textarea>
                        </div>
                    </div>
                );
            case 'wifi':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Wi-Fi síť</h3>
                        <div>
                            <label htmlFor="ssid" className="block text-sm font-medium text-gray-700">SSID sítě:</label>
                            <input
                                type="text"
                                id="ssid"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={wifiData.ssid}
                                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                                placeholder="Název sítě"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Heslo:</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={wifiData.password}
                                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                                placeholder="Heslo k síti"
                            />
                        </div>
                        <div>
                            <label htmlFor="encryption" className="block text-sm font-medium text-gray-700">Šifrování:</label>
                            <select
                                id="encryption"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={wifiData.encryption}
                                onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value })}
                            >
                                <option value="WPA/WPA2">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Žádné</option>
                            </select>
                        </div>
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">E-mail</h3>
                        <div>
                            <label htmlFor="emailTo" className="block text-sm font-medium text-gray-700">Komu:</label>
                            <input
                                type="email"
                                id="emailTo"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={emailData.to}
                                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                placeholder="prijemce@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700">Předmět:</label>
                            <input
                                type="text"
                                id="emailSubject"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                placeholder="Předmět e-mailu"
                            />
                        </div>
                        <div>
                            <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700">Zpráva:</label>
                            <textarea
                                id="emailBody"
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={emailData.body}
                                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                placeholder="Text zprávy"
                            ></textarea>
                        </div>
                    </div>
                );
            case 'phone':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Telefonní číslo</h3>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefonní číslo:</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={phoneData}
                                onChange={(e) => setPhoneData(e.target.value)}
                                placeholder="+420 123 456 789"
                            />
                        </div>
                    </div>
                );
            case 'sms':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">SMS zpráva</h3>
                        <div>
                            <label htmlFor="smsNumber" className="block text-sm font-medium text-gray-700">Telefonní číslo:</label>
                            <input
                                type="tel"
                                id="smsNumber"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={smsData.number}
                                onChange={(e) => setSmsData({ ...smsData, number: e.target.value })}
                                placeholder="+420 123 456 789"
                            />
                        </div>
                        <div>
                            <label htmlFor="smsMessage" className="block text-sm font-medium text-gray-700">Zpráva:</label>
                            <textarea
                                id="smsMessage"
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={smsData.message}
                                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                                placeholder="Text SMS zprávy"
                            ></textarea>
                        </div>
                    </div>
                );
            case 'geo':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Geografická poloha</h3>
                        <div>
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Zeměpisná šířka:</label>
                            <input
                                type="number"
                                id="latitude"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={geoData.latitude}
                                onChange={(e) => setGeoData({ ...geoData, latitude: e.target.value })}
                                placeholder="Např. 50.0755"
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Zeměpisná délka:</label>
                            <input
                                type="number"
                                id="longitude"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={geoData.longitude}
                                onChange={(e) => setGeoData({ ...geoData, longitude: e.target.value })}
                                placeholder="Např. 14.4378"
                            />
                        </div>
                    </div>
                );
            case 'event':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Událost (Kalendář)</h3>
                        <div>
                            <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">Název události:</label>
                            <input
                                type="text"
                                id="eventTitle"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={eventData.title}
                                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                placeholder="Název události"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">Místo:</label>
                            <input
                                type="text"
                                id="eventLocation"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={eventData.location}
                                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                placeholder="Místo konání"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventStart" className="block text-sm font-medium text-gray-700">Začátek:</label>
                            <input
                                type="datetime-local"
                                id="eventStart"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={eventData.start}
                                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700">Konec:</label>
                            <input
                                type="datetime-local"
                                id="eventEnd"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={eventData.end}
                                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4 font-inter overflow-y-auto">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 mb-8">
                <div className="bg-gray-700 p-4 rounded-xl flex justify-center items-center mb-6 border border-gray-600" ref={qrCodeRef}>
                    <QRCodeCanvas
                        value={qrType === 'text' ? qrText : modalQrContent}
                        size={200}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        className="rounded-lg"
                    />
                </div>

                <div className="bg-gray-700 p-4 rounded-xl mb-6 border border-gray-600">
                    <textarea
                        className="w-full h-32 p-3 bg-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none"
                        placeholder="Zde napište zprávu, vložte odkaz, atd."
                        value={qrText}
                        onChange={handleQrTextChange}
                    ></textarea>
                </div>

                <div className="flex justify-between space-x-4 mb-6">
                    <button
                        onClick={() => setShowDownloadOptions(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-green-500"
                    >
                        Stáhnout QR Kód
                    </button>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setQrType('wifi');
                            generateQrContent();
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-indigo-500"
                    >
                        Vytvořit jiné
                    </button>
                </div>
            </div>

            {showModal && (
                // NOVÉ: Přidán id="modal-backdrop" a onClick handler pro zavření modálního okna
                <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col md:flex-row relative">
                        <div className={`md:hidden absolute top-4 left-4 z-20 ${showSideMenu ? 'hidden' : ''}`}>
                            <button onClick={() => setShowSideMenu(!showSideMenu)} className="text-white text-2xl p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                        </div>

                        <div className={`fixed inset-0 bg-gray-700 z-10 p-4 transform transition-transform duration-300 ease-in-out ${showSideMenu ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/3 md:rounded-xl md:mb-0 md:mr-4 md:border md:border-gray-600`}>
                            <div className="md:hidden absolute top-4 right-4">
                                <button onClick={() => setShowSideMenu(false)} className="text-white text-2xl p-2 rounded-lg bg-gray-800 hover:bg-gray-900">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-4">Typ QR kódu</h2>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => { setQrType('wifi'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'wifi' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faWifi} className="mr-2" /> Wi-Fi síť
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('email'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> E-mail
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('phone'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'phone' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" /> Telefon
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('sms'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'sms' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faSms} className="mr-2" /> SMS
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('geo'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'geo' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Poloha
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('event'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'event' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Událost
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => { setQrType('text'); setShowSideMenu(false); }}
                                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faLink} className="mr-2" /> Text/URL
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="flex-1 bg-gray-700 p-6 rounded-xl border border-gray-600 flex flex-col z-0">
                            <h2 className="text-xl font-bold text-green-400 mb-4">Obsah, který se vloží do QR kódu</h2>
                            <div className="flex-1 mb-6">
                                {renderModalContent()}
                            </div>

                            <div className="bg-gray-600 p-4 rounded-xl flex justify-center items-center mb-6 border border-gray-500" ref={qrCodeRef}>
                                <QRCodeCanvas
                                    value={modalQrContent}
                                    size={180}
                                    level="H"
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    className="rounded-lg"
                                />
                            </div>

                            <button
                                onClick={() => setShowDownloadOptions(true)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-green-500 mb-4"
                            >
                                Stáhnout QR Kód
                            </button>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setQrType('text');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Zavřít
                            </button>

                            {showDownloadOptions && (
                                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
                                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-sm text-center">
                                        <h2 className="text-xl font-bold text-white mb-4">Vyberte formát</h2>
                                        <div className="flex flex-col space-y-3 mb-6">
                                            <button
                                                onClick={() => handleDownload('png')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Stáhnout PNG
                                            </button>
                                            <button
                                                onClick={() => handleDownload('jpeg')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Stáhnout JPG
                                            </button>
                                            <button
                                                onClick={() => handleDownload('svg')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Stáhnout SVG
                                            </button>
                                            <button
                                                onClick={handleCopyUrl}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Kopírovat URL obrázku
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setShowDownloadOptions(false)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                        >
                                            Zavřít
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;