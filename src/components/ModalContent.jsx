import React from 'react';

const ModalContent = ({ qrType, formData, onFormDataChange }) => {
    // Důležité: Tady je veškerá logika pro rendrování formulářů. Pro přidání nového typu QR kódu stačí přidat další 'case'
    switch (qrType) {
        case 'text':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Text / URL</h3>
                    <div>
                        <label htmlFor="modalQrText" className="block text-sm font-medium text-gray-300">Obsah QR kódu:</label>
                        <textarea
                            id="modalQrText"
                            rows="5"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.text}
                            onChange={(e) => onFormDataChange('text', e.target.value)}
                            placeholder="Zde napište zprávu nebo vložte URL odkaz."
                        ></textarea>
                    </div>
                </div>
            );
        case 'wifi':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Wi-Fi síť</h3>
                    <div>
                        <label htmlFor="ssid" className="block text-sm font-medium text-gray-300">SSID sítě:</label>
                        <input
                            type="text"
                            id="ssid"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.wifi.ssid}
                            onChange={(e) => onFormDataChange('wifi', { ...formData.wifi, ssid: e.target.value })}
                            placeholder="Název sítě"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Heslo:</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.wifi.password}
                            onChange={(e) => onFormDataChange('wifi', { ...formData.wifi, password: e.target.value })}
                            placeholder="Heslo k síti"
                        />
                    </div>
                    <div>
                        <label htmlFor="encryption" className="block text-sm font-medium text-gray-300">Šifrování:</label>
                        <select
                            id="encryption"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.wifi.encryption}
                            onChange={(e) => onFormDataChange('wifi', { ...formData.wifi, encryption: e.target.value })}
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
                    <h3 className="text-xl font-semibold text-white">E-mail</h3>
                    <div>
                        <label htmlFor="emailTo" className="block text-sm font-medium text-gray-300">Komu:</label>
                        <input
                            type="email"
                            id="emailTo"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.email.to}
                            onChange={(e) => onFormDataChange('email', { ...formData.email, to: e.target.value })}
                            placeholder="prijemce@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-300">Předmět:</label>
                        <input
                            type="text"
                            id="emailSubject"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.email.subject}
                            onChange={(e) => onFormDataChange('email', { ...formData.email, subject: e.target.value })}
                            placeholder="Předmět e-mailu"
                        />
                    </div>
                    <div>
                        <label htmlFor="emailBody" className="block text-sm font-medium text-gray-300">Zpráva:</label>
                        <textarea
                            id="emailBody"
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.email.body}
                            onChange={(e) => onFormDataChange('email', { ...formData.email, body: e.target.value })}
                            placeholder="Text zprávy"
                        ></textarea>
                    </div>
                </div>
            );
        case 'phone':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Telefonní číslo</h3>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">Telefonní číslo:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.phone}
                            onChange={(e) => onFormDataChange('phone', e.target.value)}
                            placeholder="+420 123 456 789"
                        />
                    </div>
                </div>
            );
        case 'sms':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">SMS zpráva</h3>
                    <div>
                        <label htmlFor="smsNumber" className="block text-sm font-medium text-gray-300">Telefonní číslo:</label>
                        <input
                            type="tel"
                            id="smsNumber"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.sms.number}
                            onChange={(e) => onFormDataChange('sms', { ...formData.sms, number: e.target.value })}
                            placeholder="+420 123 456 789"
                        />
                    </div>
                    <div>
                        <label htmlFor="smsMessage" className="block text-sm font-medium text-gray-300">Zpráva:</label>
                        <textarea
                            id="smsMessage"
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.sms.message}
                            onChange={(e) => onFormDataChange('sms', { ...formData.sms, message: e.target.value })}
                            placeholder="Text SMS zprávy"
                        ></textarea>
                    </div>
                </div>
            );
        case 'geo':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Geografická poloha</h3>
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-300">Zeměpisná šířka:</label>
                        <input
                            type="number"
                            id="latitude"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.geo.latitude}
                            onChange={(e) => onFormDataChange('geo', { ...formData.geo, latitude: e.target.value })}
                            placeholder="Např. 50.0755"
                        />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-300">Zeměpisná délka:</label>
                        <input
                            type="number"
                            id="longitude"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.geo.longitude}
                            onChange={(e) => onFormDataChange('geo', { ...formData.geo, longitude: e.target.value })}
                            placeholder="Např. 14.4378"
                        />
                    </div>
                </div>
            );
        case 'event':
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Událost (Kalendář)</h3>
                    <div>
                        <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-300">Název události:</label>
                        <input
                            type="text"
                            id="eventTitle"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.event.title}
                            onChange={(e) => onFormDataChange('event', { ...formData.event, title: e.target.value })}
                            placeholder="Název události"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-300">Místo:</label>
                        <input
                            type="text"
                            id="eventLocation"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.event.location}
                            onChange={(e) => onFormDataChange('event', { ...formData.event, location: e.target.value })}
                            placeholder="Místo konání"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventStart" className="block text-sm font-medium text-gray-300">Začátek:</label>
                        <input
                            type="datetime-local"
                            id="eventStart"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.event.start}
                            onChange={(e) => onFormDataChange('event', { ...formData.event, start: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="eventEnd" className="block text-sm font-medium text-gray-300">Konec:</label>
                        <input
                            type="datetime-local"
                            id="eventEnd"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.event.end}
                            onChange={(e) => onFormDataChange('event', { ...formData.event, end: e.target.value })}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export default ModalContent;