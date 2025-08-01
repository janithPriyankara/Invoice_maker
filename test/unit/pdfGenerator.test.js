const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { generatePDFInvoice } = require('../../pdfGenerator');

describe('generatePDFInvoice', () => {
  it('creates a PDF document', async () => {
    const details = {
      customerName: 'John',
      customerAddress: '123',
      customerTp: '111',
      customerEmail: 'a@b.c',
      invoiceNumber: '1',
      dateOfInvoice: '2024-01-01',
      shipping: 0,
      items: [{ description: 'd', quantity: 1, unitPrice: 2 }]
    };

    const pdfBytes = await generatePDFInvoice(details, path.join(__dirname, '../../invoice_template.jpg'));
    expect(pdfBytes).to.be.instanceof(Uint8Array);
    const header = Buffer.from(pdfBytes).subarray(0, 4).toString();
    expect(header).to.equal('%PDF');
  });
});
