const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const pdfGenerator = require('../../pdfGenerator');
const { app } = require('../../server');

describe('API integration tests', () => {
  const validInvoice = {
    customerName: 'John',
    customerAddress: '123',
    customerTp: '111',
    customerEmail: 'a@b.c',
    invoiceNumber: '1',
    dateOfInvoice: '2024-01-01',
    shipping: 0,
    items: [{ description: 'd', quantity: 1, unitPrice: 2 }]
  };

  it('POST /generate-invoice returns PDF', async () => {
    const res = await request(app)
      .post('/generate-invoice')
      .send(validInvoice)
      .expect(201);
    expect(res.headers['content-type']).to.match(/application\/pdf/);
    expect(res.body).to.be.instanceof(Buffer);
  });

  it('POST /generate-invoice with invalid body returns 400', async () => {
    await request(app)
      .post('/generate-invoice')
      .send({})
      .expect(400);
  });

  it('GET /generate-invoice returns 501', async () => {
    await request(app)
      .get('/generate-invoice')
      .expect(501);
  });

  it('GET unknown route returns 404', async () => {
    await request(app)
      .get('/unknown')
      .expect(404);
  });

  it('returns 503 when PDF generation fails', async () => {
    const stub = sinon.stub(pdfGenerator, 'generatePDFInvoice').rejects(new Error('fail'));
    await request(app)
      .post('/generate-invoice')
      .send(validInvoice)
      .expect(503);
    stub.restore();
  });
});
