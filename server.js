// server.js

const { spawn } = require('node:child_process');
const multer = require('multer');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let userId;

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			userId = req.body.userID;
			const path = `./uploads/${userId}`;
			fs.mkdirsSync(path);
			callback(null, path);
		},
		filename: (req, file, callback) => {
			//originalname is the uploaded file's name with extn
			callback(null, file.originalname);
		},
	}),
});

app.post('/upload_files', upload.array('files'), main);

async function main(req, res) {
	console.log(req.files);
	//console.log(req);
	console.log(req.body.userID);
	res.json({ message: 'Successfully uploaded files' });
	await Promise.all(
		req.files.map(async file => {
			console.log('inside promise');
			const filePath = `./uploads/${userId}/` + file.filename;
			console.log('filepath is: ', filePath);
			const absPath = path.resolve(filePath);
			console.log('absolute filepath is: ', absPath);
			let dataToSend;
			const childPython = spawn('python3', ['./page_dewarp.py', absPath]);
			console.log('after spawn');
			// collect data from script
			childPython.stdout.on('data', function (data) {
				console.log('Pipe data from python script ...');
				dataToSend = data.toString();
			});
			// in close event we are sure that stream from child process is closed
			childPython.on('close', code => {
				console.log(`child process close all stdio with code ${code}`);
			});
			res.send(dataToSend);
		})
	);
}

app.listen(5005, () => {
	console.log(`Server started...`);
});
