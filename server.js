const express = require('express');
const { generatePDFInvoice } = require('./pdfGenerator.js');
const fs = require('fs');

const app = express();
app.use(express.json());

// Load configuration from config.json
const configData = fs.readFileSync('config.json');
const config = JSON.parse(configData);

const PORT = config.port || 3000; // Use the port from config.json or default to 3000

app.post('/generate-invoice', async (req, res) => {
    try {
        // Extract invoiceDetails from the request body
        const invoiceDetails = req.body;

        const invoiceTemplatePath = 'invoice_template.jpg';

        const pdfBytes = await generatePDFInvoice(invoiceDetails, invoiceTemplatePath);

        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generating PDF invoice:', error);
        res.status(500).send('Error generating PDF invoice');
    }
});

app.listen(PORT, () => {
    console.log(`PDF generation microservice is running on port ${PORT}`);
});
