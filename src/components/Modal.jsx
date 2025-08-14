import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SideMenu from './SideMenu.jsx';
import ModalContent from './ModalContent.jsx';
import { QRCodeCanvas } from 'qrcode.react';

const Modal = ({ qrType, modalQrContent, showSideMenu, formData, setQrType, onFormDataChange, onClose, onSideMenuToggle, qrCodeRef, onDownloadClick, handleBackdropClick }) => {
    return (
        <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col md:flex-row relative">
                <div className={`md:hidden absolute top-4 left-4 z-20 ${showSideMenu ? 'hidden' : ''}`}>
                    <button onClick={onSideMenuToggle} className="text-white text-2xl p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>

                <SideMenu
                    qrType={qrType}
                    onQrTypeChange={setQrType}
                    showSideMenu={showSideMenu}
                    onSideMenuToggle={onSideMenuToggle}
                />

                <div className="flex-1 bg-gray-700 p-6 rounded-xl border border-gray-600 flex flex-col z-0">
                    <h2 className="text-xl font-bold text-green-400 mb-4">Obsah, který se vloží do QR kódu</h2>
                    <div className="flex-1 mb-6">
                        <ModalContent
                            qrType={qrType}
                            formData={formData}
                            onFormDataChange={onFormDataChange}
                        />
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
                        onClick={onDownloadClick}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-green-500 mb-4"
                    >
                        Stáhnout QR Kód
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Zavřít
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;