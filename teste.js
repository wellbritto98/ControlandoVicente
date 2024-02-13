const chromium = require('chromium');
const {execFile} = require('child_process');

execFile(chromium.path, ['https://google.com'], err => {
	console.log('Hello Google!');
});