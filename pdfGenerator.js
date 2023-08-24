const { drawText, drawImage, drawGrid, drawTable } = require('./drawUtils');


const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function generatePDFInvoice(details, invoiceTemplatePath) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Load the existing invoice template as a background image
    const templateImage = await pdfDoc.embedJpg(fs.readFileSync(invoiceTemplatePath));
    page.drawImage(templateImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
    });



    // Add a grid overlay
    // const gridSpacing = 10; // Set the spacing between grid lines
    // const gridColor = rgb(0.5, 0.5, 0.5); // Set the color of the grid lines
    // drawGrid(page, font, gridSpacing, gridColor, width, height);


    drawText(page, font, "Invoice To", 50, 640, { color: rgb(0.2, 0.4, 0.3), fontSize: 14, lineSpacing: 1 });
    drawText(page, font, details.customerName, 50, 624, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });
    drawText(page, font, details.customerAddress, 50, 610, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });

    drawText(page, font, "Contacts", 250, 640, { color: rgb(0.2, 0.4, 0.3), fontSize: 14, lineSpacing: 1 });
    drawText(page, font, details.customerTp, 250, 624, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });
    drawText(page, font, details.customerEmail, 250, 608, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });

    drawText(page, font, "Invoice Number", 450, 640, { color: rgb(0.2, 0.4, 0.3), fontSize: 14, lineSpacing: 1 });
    drawText(page, font, details.invoiceNumber, 511, 624, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });

    drawText(page, font, "Date of Invoice", 455, 604, { color: rgb(0.2, 0.4, 0.3), fontSize: 14, lineSpacing: 1 });
    drawText(page, font, details.dateOfInvoice, 493, 588, { color: rgb(0, 0, 0), fontSize: 11, lineSpacing: 1.25 });



    // draw Data table
    const tableData = [
        ['Description', 'Qty', 'Unit Price(Rs)', 'Total Price(Rs)'],
    ];

    const cellWidths = [250, 50, 100, 100];
    const tableFormatOptionsons = [

        { alignment: 'center', font: font, fontSize: 12, textColor: rgb(1, 1, 1), cellColor: rgb(0.2, 0.4, 0.3), cellHeight: 30 },

    ];

    const tableX = 50;
    const tableY = 500;

    totalPrice = 0;
    details.items.forEach((item, index) => {
        tableData.push([item.description, String(item.quantity), "Rs:"+String(item.unitPrice)+".00","Rs:"+ String(item.unitPrice * item.quantity)+".00"]);
        tableFormatOptionsons.push({ alignment: 'center', font: font, fontSize: 11, textColor: rgb(0, 0, 0), cellHeight: 25 })
        totalPrice += item.unitPrice * item.quantity;
    });

    drawTable(page, tableData, tableX, tableY, cellWidths, tableFormatOptionsons, { borderColor: rgb(0.8, 0.8, 0.8) });


    // draw the total table
    const tableTotal = [
        ['Sub Total : ', "Rs:"+String(totalPrice)+".00"],
        ['Shipping : ', String(details.shipping)],
        ['Invoice Total : ', "Rs:"+String(totalPrice + details.shipping)+".00"]
    ];

    const cellWidthsTotal = [80, 50];
    const tableFormatOptionsonsTotal = [

        { alignment: 'left', font: font, fontSize: 12, textColor: rgb(0, 0, 0), cellHeight: 20 },
        { alignment: 'left', font: font, fontSize: 12, textColor: rgb(0, 0, 0), cellHeight: 20 },
        { alignment: 'left', font: font, fontSize: 12, textColor: rgb(0, 0, 0), cellHeight: 20 }
    ];

    const tableXTotal = 385;
    const tableYTotal = 120;
    drawTable(page, tableTotal, tableXTotal, tableYTotal, cellWidthsTotal, tableFormatOptionsonsTotal, { borderColor: rgb(1, 1, 1) });





    // drawImage(pdfDoc, page, logoPath, 50, 50, 100, 50);

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync('test_pdf.pdf', pdfBytes);
    return pdfBytes;
}
module.exports = { generatePDFInvoice };
