import { saveAs } from 'file-saver';

/**
 * Generuje obsah QR kódu na základě typu a dat.
 * @param {string} qrType Typ QR kódu (např. 'wifi', 'email').
 * @param {object} data Data pro daný typ QR kódu.
 * @returns {string} Textový obsah pro QR kód.
 */
export const generateQrContent = (qrType, data) => {
  switch (qrType) {
    case 'text':
      return data;
    case 'wifi':
      return `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};;`;
    case 'email':
      return `mailto:${data.to}?subject=${encodeURIComponent(
        data.subject
      )}&body=${encodeURIComponent(data.body)}`;
    case 'phone':
      return `tel:${data}`;
    case 'sms':
      return `smsto:${data.number}:${encodeURIComponent(data.message)}`;
    case 'geo':
      return `geo:${data.latitude},${data.longitude}`;
    case 'event': {
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      let formattedStartDate = !isNaN(startDate.getTime())
        ? startDate.toISOString().replace(/[-:]|\.\d{3}/g, '')
        : '';
      let formattedEndDate = !isNaN(endDate.getTime())
        ? endDate.toISOString().replace(/[-:]|\.\d{3}/g, '')
        : '';

      let content = `BEGIN:VEVENT\nSUMMARY:${data.title}\nLOCATION:${data.location}`;
      if (formattedStartDate) {
        content += `\nDTSTART:${formattedStartDate}`;
      }
      if (formattedEndDate) {
        content += `\nDTEND:${formattedEndDate}`;
      }
      content += `\nEND:VEVENT`;
      return content;
    }
    default:
      return '';
  }
};

/**
 * Stáhne QR kód v zadaném formátu.
 * @param {string} format Formát pro stažení ('png', 'jpeg', 'svg').
 * @param {HTMLDivElement} qrCodeRef Reference na element s QR kódem.
 * @param {string} filenamePrefix Předpona názvu souboru.
 */
export const handleDownload = (format, qrCodeRef, filenamePrefix) => {
  const canvas = qrCodeRef?.querySelector('canvas');
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }

  const filename = `qrcode_${filenamePrefix
    .substring(0, 10)
    .replace(/[^a-zA-Z0-9]/g, '')}`;

  if (format === 'png') {
    canvas.toBlob((blob) => {
      saveAs(blob, `${filename}.png`);
    });
  } else if (format === 'jpeg') {
    canvas.toBlob(
      (blob) => {
        saveAs(blob, `${filename}.jpg`);
      },
      'image/jpeg',
      0.9
    );
  } else if (format === 'svg') {
    const svgString = `
            <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#FFFFFF"/>
                ${Array.from(
                  canvas
                    .getContext('2d')
                    .getImageData(0, 0, canvas.width, canvas.height).data
                )
                  .filter((_, i) => (i + 1) % 4 !== 0)
                  .reduce((acc, val, i) => {
                    if (i % 3 === 0) {
                      const x = (i / 3) % canvas.width;
                      const y = Math.floor(i / 3 / canvas.width);
                      if (val === 0) {
                        acc.push(
                          `<rect x="${x}" y="${y}" width="1" height="1" fill="#000000"/>`
                        );
                      }
                    }
                    return acc;
                  }, [])
                  .join('')}
            </svg>
        `;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
  }
};

/**
 * Kopíruje URL obrázku do schránky.
 * @param {string} qrDataUrl Data URL obrázku.
 */
export const handleCopyUrl = (qrDataUrl) => {
  if (qrDataUrl) {
    const textarea = document.createElement('textarea');
    textarea.value = qrDataUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('URL zkopírována do schránky!');
  }
};
