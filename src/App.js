import React from "react";
import * as firebase from 'firebase';
import "./App.css";

let optimizedUrl;
let placeholderUrl;
let data = false;
let id;
let imageClass;
let optimized = false;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: false, slectedFile: null }
		this.handleOptimizedUpload = this.handleOptimizedUpload.bind(this);
		this.handlePlaceholderUpload = this.handlePlaceholderUpload.bind(this);
	}

	componentDidMount() {
		db.collection('oliverdiscographer').get().then((snapshot) => {
			data = snapshot.docs;
		});
	}
	
	handleOptimizedUpload(e) {
		const file = e.target.files[0];
		if (file) {
			const uploadTask = storage.ref('/oliverDiscographer/' + file.name).put(file);
			uploadTask.on('state_changed', function(snapshot) {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			}, function(error) {
				alert('Error occured whilst uploading image: ' + error)
			}, function() {
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					console.log('File available at', downloadURL);
					optimizedUrl = downloadURL;
				});
			});
		}
	}

	handlePlaceholderUpload(e) {
		const file = e.target.files[0];
		if (file) {
			const uploadTask = storage.ref('/oliverDiscographer/' + file.name).put(file);
			uploadTask.on('state_changed', function(snapshot) {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			}, function(error) {
				alert('Error occured whilst uploading image: ' + error)
			}, function() {
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					console.log('File available at', downloadURL);
					placeholderUrl = downloadURL;
				});
			});
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		const size = e.target.height.value === 'portrait' ? '525px' : '233px';

		if (e.target.optimized.value === '' || e.target.placeholder.value === '' || e.target.height.value === '' || e.target.class.value === '') {
			alert('You\'re missing something');
		} else if (data) {
			id = data.map(data => data.data().id).length;
			imageClass = data.map(data => data.data().class);
			db.collection('oliverdiscographer').add({
				optimized: optimizedUrl,
				placeholder: placeholderUrl,
				height: size,
				id: id += 1,
				class: e.target.class.value,
			});
		}		
		e.target.optimized.value = '';
		e.target.placeholder.value = '';
		e.target.height.value = '';
		e.target.class.value = '';
	}

	render() {
		return ([
			<div className="header">
				<h2 style={{ marginBottom: '0px', marginTop: '0px' }}>OliverDiscographer</h2>
			</div>,
			<div className="content">
				<form className="form-wrapper" onSubmit={this.handleSubmit}>
					<label for="optimized">Optimized</label>
					<input id="optimized" type="file" name="optimized" placeholder="optimized" onChange={this.handleOptimizedUpload} />

					<label for="placeholder">Placeholder</label>
					<input id="placeholder" type="file" name="placeholder" placeholder="placeholder" onChange={this.handlePlaceholderUpload} />

					<label for="size">Size</label>
					<select id="size" name="height">
						<option value="portrait">Portrait</option>
						<option value="landscape">Landscape</option>
					</select>

					<label for="class">Class</label>
					<input id="class" type="text" name="class" placeholder="class" />

					<button>submit</button>
				</form>
			</div>
		]);
	}
}

const config = {
	apiKey: "AIzaSyASyzXnkx1O-6ZMKkFg_-lBz0gRTaLBQj8",
	authDomain: "oliver-cms.firebaseapp.com",
	databaseURL: "https://oliver-cms.firebaseio.com",
	projectId: "oliver-cms",
	storageBucket: "oliver-cms.appspot.com",
	messagingSenderId: "908146650993"
};

firebase.initializeApp(config);
const db = firebase.firestore();
const storage = firebase.storage();
export default App;
