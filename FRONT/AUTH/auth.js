async function handleRegister() {
	let name = document.querySelector("#username").value;
	let photo = document.querySelector("#photo").value;
	let email = document.querySelector("#email").value;
	let password = document.querySelector("#password").value;
	let postModal = document.querySelector(".postModal");

	event.PreventDefault;

	handlePhoto();

	let user = {
		name: name,
		photo: photo,
		email: email,
		password: password,
	};
	let request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(user),
	};

	let apiRequest = fetch("http://localhost:7000/user/register", request);
	let response = await apiRequest;

	console.log(response);
	if (response.status === 200) {
		postModal.classList.remove("hidden");
	} else {
		alert("Invalid credentials");
	}
}

function removeModal() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.add("hidden");
}

async function handleLogin() {
	let email = document.querySelector("#login-email").value;
	let password = document.querySelector("#login-password").value;

	let user = {
		email: email,
		password: password,
	};

	let request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(user),
	};

	let apiRequest = fetch("http://localhost:7000/user/login", request);
	let response = await apiRequest;
	let data = await response.json();
	console.log(response);
	if (response.status === 200) {
		let jwt = data.jwt;
		let role = data.role;
		window.sessionStorage.setItem("jwt", jwt);
		window.sessionStorage.setItem("role", role);
		if (role === "admin") {
			window.location.href = "../ADMIN/admin.html";
		} else {
			window.location.href = "../USER/user.html";
		}
	} else {
		alert("Invalid credentials");
	}
}

let photo = document.querySelector("#photo");
console.log(photo);
async function handlePhoto() {
	console.log("allo");
	const image = photo.files[0];

	const formData = new FormData();
	formData.append("photo", photo.files[0]);
	console.log(image, formData);
	let request = {
		method: "POST",

		body: formData,
	};
	console.log(photo);

	let apiRequest = await fetch("http://localhost:7000/user/photo", request);
	let response = await apiRequest;
	const data = await apiRequest.json();
	console.log(data);
	if (response.status === 200) {
		console.log(response);
	} else {
		alert("Invalid photo");
	}
}

function passwordModal() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.remove("hidden");
}

async function resetPassword() {
	let password = document.querySelector("#resetPass").value;
	let email = document.querySelector("#resetEmail").value;
	let name = document.querySelector("#resetName").value;

	let user = {
		name: name,
		email: email,
		new_password: password,
	};
	let request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(user),
	};

	let apiRequest = await fetch("http://localhost:7000/user/reset", request);
	let response = await apiRequest;
	let truc = response.json();

	console.log(response, truc);
	if (response.status === 200) {
		alert("reset success");
	} else {
		alert("reset fail");
	}
}
