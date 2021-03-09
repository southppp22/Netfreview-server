const fs = require('fs');

const myfile = JSON.parse(fs.readFileSync('videoData.json', 'utf-8'))

console.log(myfile.data.length);