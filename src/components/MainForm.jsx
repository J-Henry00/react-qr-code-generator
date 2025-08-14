import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const MainForm = ({ qrText, onQrTextChange, onDownloadClick, onModalOpen, qrCodeRef }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 mb-8">
            <div className="bg-gray-700 p-4 rounded-xl flex justify-center items-center mb-6 border border-gray-600" ref={qrCodeRef}>
                <QRCodeCanvas
                    value={qrText}
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
                    onChange={onQrTextChange}
                ></textarea>
            </div>

            <div className="flex justify-between space-x-4">
                <button
                    onClick={onDownloadClick}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-green-500"
                >
                    Stáhnout QR Kód
                </button>
                <button
                    onClick={onModalOpen}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border border-indigo-500"
                >
                    Vytvořit jiné
                </button>
            </div>
        </div>
    );
};

export default MainForm;