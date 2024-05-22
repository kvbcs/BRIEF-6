let jwt = window.sessionStorage.getItem("jwt");
let role = window.sessionStorage.getItem("role");

function handleDisconnect() {
	window.sessionStorage.clear(jwt);
	window.sessionStorage.clear(role);
	setTimeout(() => {
		window.location.href = "../INDEX/index.html";
	}, 1000);
}
