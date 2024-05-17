console.log("alo");

async function handleRegister() {
	let name = document.querySelector("#name").value;
	let photo = document.querySelector("#photo").value;
	let email = document.querySelector("#email").value;
	let password = document.querySelector("#password").value;

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
		window.location.href = "./login.html";
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
