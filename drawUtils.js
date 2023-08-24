const { rgb } = require('pdf-lib');

async function drawText(page, font, text, x, y, options = {}) {
    const { color = rgb(0, 0, 0), fontSize = 12, fontName = font, lineSpacing = 1 } = options;
    const lineHeight = fontSize * lineSpacing;
    page.drawText(text, { x, y, color, font: fontName, size: fontSize, lineHeight });
}

async function drawTable(page, data, x, y, cellWidths, formatOptions, borderOptions) {
    const numRows = data.length;
    const numCols = data[0].length;

    for (let i = 0; i < numRows; i++) {
        cellX = x;
        for (let j = 0; j < numCols; j++) {
            const cellY = y - i * formatOptions[i].cellHeight;

            const text = data[i][j];
            const formatOption = formatOptions[i];

            // Draw table cell
            page.drawRectangle({
                x: cellX,
                y: cellY,
                width: cellWidths[j],
                height: formatOption.cellHeight,
                color: formatOption.cellColor,
                borderColor: borderOptions.borderColor,
                borderWidth: borderOptions.borderWidth,
            });

            // Draw text in table cell
            drawText(page, formatOption.font, text, cellX + 5, cellY + 5, { fontSize: formatOption.fontSize, color: formatOption.textColor });
        
            cellX = cellX+ cellWidths[j];
        }
    }
}

module.exports = { drawText, drawTable };
