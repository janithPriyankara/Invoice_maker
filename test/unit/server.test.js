const { expect } = require('chai');
const { validateInvoiceDetails } = require('../../server');

describe('validateInvoiceDetails', () => {
  it('returns true for valid details', () => {
    const details = { items: [{ description: 'a', quantity: 1, unitPrice: 1 }] };
    expect(validateInvoiceDetails(details)).to.be.true;
  });

  it('returns false when items are missing', () => {
    const details = { items: [] };
    expect(validateInvoiceDetails(details)).to.be.false;
  });
});
