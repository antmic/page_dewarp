// server.js

const { spawn } = require('node:child_process');
const multer = require('multer');
const path = require('path');

const upload = multer({
	storage: multer.diskStorage({
		destination: './uploads/',
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		},
	}),
});

const express = require('express');
const cors = require('cors');
const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload_files', upload.array('files'), uploadFiles);

function uploadFiles(req, res) {
	// console.log(req.body);
	console.log(req.files);
	res.json({ message: 'Successfully uploaded files' });
	req.files.forEach(element => {
		const filePath = './uploads/' + element.filename;
		console.log(filePath);
		const childPython = spawn('python3', ['./page_dewarp.py', filePath]);
	});
}

app.listen(5005, () => {
	console.log(`Server started...`);
});
