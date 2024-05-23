async function handleRegister() {
	let name = document.querySelector("#username").value;
	let photo = document.querySelector("#photo").value;
	let email = document.querySelector("#email").value;
	let password = document.querySelector("#password").value;
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
		// window.location.href = "./login.html";
	} else {
		alert("Invalid credentials");
	}
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

		body: photo,
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
