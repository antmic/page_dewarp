// script.js
let uuid = self.crypto.randomUUID();
console.log(uuid);

const form = document.getElementById('form');

form.addEventListener('submit', submitForm);

function submitForm(e) {
	e.preventDefault();
	const files = document.getElementById('files');
	const formData = new FormData();
	formData.append('userID', uuid);
	for (let i = 0; i < files.files.length; i++) {
		formData.append('files', files.files[i]);
	}
	fetch('http://localhost:5005/upload_files', {
		method: 'POST',
		body: formData,
	})
		.then(res => res.json())
		.then(res => alert(res.message))
		.then(res => alert(res))
		.catch(err => ('Error occured', err));
}
