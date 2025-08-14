import React from 'react';

const DownloadOptions = ({ onClose, onDownload, onCopyUrl }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold text-white mb-4">Vyberte formát</h2>
                <div className="flex flex-col space-y-3 mb-6">
                    <button
                        onClick={() => onDownload('png')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Stáhnout PNG
                    </button>
                    <button
                        onClick={() => onDownload('jpeg')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Stáhnout JPG
                    </button>
                    <button
                        onClick={() => onDownload('svg')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Stáhnout SVG
                    </button>
                    <button
                        onClick={onCopyUrl}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Kopírovat URL obrázku
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                    Zavřít
                </button>
            </div>
        </div>
    );
};

export default DownloadOptions;