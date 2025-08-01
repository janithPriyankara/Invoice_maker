const express = require('express');
const pdfGenerator = require('./pdfGenerator.js');
const fs = require('fs');

const app = express();
app.use(express.json());

// Load configuration from config.json
const configData = fs.readFileSync('config.json');
const config = JSON.parse(configData);

const PORT = config.port || 3000; // Use the port from config.json or default to 3000

// Validate required invoice fields
function validateInvoiceDetails(details) {
    return details && Array.isArray(details.items) && details.items.length > 0;
}

app.post('/generate-invoice', async (req, res) => {
    if (!validateInvoiceDetails(req.body)) {
        return res.status(400).json({ error: 'Invalid invoice details' });
    }

    try {
        const invoiceDetails = req.body;
        const invoiceTemplatePath = 'invoice_template.jpg';

        const pdfBytes = await pdfGenerator.generatePDFInvoice(invoiceDetails, invoiceTemplatePath);

        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.status(201).send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generating PDF invoice:', error);
        res.status(503).json({ error: 'Service unavailable' });
    }
});

// Not implemented route for GET on /generate-invoice
app.get('/generate-invoice', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
});

// Handle 404 for any other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`PDF generation microservice is running on port ${PORT}`);
    });
}

module.exports = { app, validateInvoiceDetails };
