import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faEnvelope, faPhone, faSms, faMapMarkerAlt, faCalendarAlt, faLink, faTimes } from '@fortawesome/free-solid-svg-icons';

const SideMenu = ({ qrType, onQrTypeChange, showSideMenu, onSideMenuToggle }) => {
    return (
        <div className={`fixed inset-0 bg-gray-700 z-10 p-4 transform transition-transform duration-300 ease-in-out ${showSideMenu ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/3 md:rounded-xl md:mb-0 md:mr-4 md:border md:border-gray-600`}>
            <div className="md:hidden absolute top-4 right-4">
                <button onClick={onSideMenuToggle} className="text-white text-2xl p-2 rounded-lg bg-gray-800 hover:bg-gray-900">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Typ QR kódu</h2>
            <ul className="space-y-2">
                <li>
                    <button
                        onClick={() => { onQrTypeChange('wifi'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'wifi' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faWifi} className="mr-2" /> Wi-Fi síť
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('email'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> E-mail
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('phone'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'phone' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faPhone} className="mr-2" /> Telefon
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('sms'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'sms' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faSms} className="mr-2" /> SMS
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('geo'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'geo' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Poloha
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('event'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'event' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Událost
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => { onQrTypeChange('text'); onSideMenuToggle(); }}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-200 ease-in-out ${qrType === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        <FontAwesomeIcon icon={faLink} className="mr-2" /> Text/URL
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SideMenu;