

var fs = require('fs');
// read file content into buffer
var bitmap = fs.readFileSync('vacation_1.jpg');
// convert buffer content into binary
var binaryImage = new Buffer.from(bitmap).toString('binary');

// Now, you have the image represented as a binary string in binaryImage.

// Let's now save this binary string into a new file
fs.writeFileSync('./binaries.txt', binaryImage);
