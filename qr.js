const QRCode = require('qrcode');
const fs = require('fs');

// Function to generate a QR code and save it as an image
async function generateQRCode(data, outputPath) {
    // Ensure that the QR code data starts with "TPDC"
    const Data = data;
    
    try {
        await QRCode.toFile(outputPath, Data,{errorCorrectionLevel: 'Q'});
        console.log(`QR code saved to ${outputPath}`);
        return outputPath;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}

// Main function to create a nested QR code
async function createNestedQRCode(innerData) {
    try {
        // Step 1: Generate the inner QR code with TPDC prefix
        console.log('Generating inner QR code...');
        const innerOutputPath = 'inner_qr_code.png';
        await generateQRCode(innerData, innerOutputPath);

        // Step 2: Encode the inner QR code file as a Base64 string
        console.log('Reading and encoding inner QR code...');
        const innerQRBuffer = fs.readFileSync(innerOutputPath);
        const innerQRBase64 = innerQRBuffer.toString('base64');

        // Step 3: Generate the outer QR code using the Base64-encoded inner QR code
        console.log('Generating outer QR code...');
        const outerOutputPath = 'outer_qr_code.png';
        await generateQRCode(`TPDC_${innerQRBase64}`, outerOutputPath);
        fs.writeFileSync("inerQRcodeIN.tpdc",`TPDC_${innerQRBase64}`)
        console.log(`Nested QR code saved as ${outerOutputPath}`);
    } catch (err) {
        console.error('Error creating nested QR code:', err);
    }
}

// Example usage
const innerData = 'Vesele Vanoce s Q';
createNestedQRCode(innerData);
