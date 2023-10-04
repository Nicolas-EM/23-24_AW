const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const app = express();

// Define a function to load an HTML file and its resources
function loadHtmlFile(filePath) {
    // Read the HTML file into a buffer
    const htmlBuffer = fs.readFileSync(filePath);

    // Convert the buffer to a string
    let htmlString = htmlBuffer.toString();

    // Find all the resource URLs in the HTML file
    const resourceRegex = /(?:src|href)="([^"]+)"/g;
    let match;
    while ((match = resourceRegex.exec(htmlString)) !== null) {
        const resourceUrl = match[1];
        const resourcePath = path.join(path.dirname(filePath), resourceUrl);
        try {
            const resourceBuffer = fs.readFileSync(resourcePath);
            const resourceBase64 = resourceBuffer.toString('base64');
            const resourceMimeType = mime.getType(resourcePath);
            const dataUri = `data:${resourceMimeType};base64,${resourceBase64}`;
            htmlString = htmlString.replace(resourceUrl, dataUri);
        } catch (err) {
            console.error(`Error loading resource ${resourceUrl}: ${err.message}`);
        }
    }

    return htmlString;
}

// Define a function to load all the HTML files in a directory
function loadHtmlDirectory(directoryPath) {
    const htmlFiles = fs.readdirSync(directoryPath).filter((fileName) => {
        return path.extname(fileName) === '.html';
    });

    const htmlMap = new Map();
    for (const htmlFile of htmlFiles) {
        const htmlFilePath = path.join(directoryPath, htmlFile);
        const htmlString = loadHtmlFile(htmlFilePath);
        htmlMap.set(htmlFile, htmlString);
    }

    return htmlMap;
}

// Serve the HTML files
const htmlMap = loadHtmlDirectory('./');
for (const [htmlFile, htmlString] of htmlMap) {
    app.get(`/${htmlFile}`, (req, res) => {
        res.send(htmlString);
    });
}

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

// const fs = require('fs');

// // Read the file into a buffer
// const bitmap = fs.readFileSync('./vacation_1.jpg');

// // Convert the buffer to a hexadecimal string
// const hexadecimalImage = bitmap.toString('hex');
// var formattedBinaryImage = '';
// for (let i = 0; i < binaryImage.length; i += 100) {
//   formattedBinaryImage += binaryImage.substr(i, 100) + '\n';
// }
// // Now, you have the image represented as a binary string in binaryImage.

// // Let's now save this binary string into a new file
// fs.writeFileSync('./binaries.txt', formattedBinaryImage);

