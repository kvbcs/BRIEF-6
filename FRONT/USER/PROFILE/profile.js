let jwt = window.sessionStorage.getItem("jwt");
let main = document.querySelector("main");

console.log("allo");

async function getMyProfile() {
	let id = jwt;
	console.log(id);

	let request = {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${jwt}`,
		},
	};
	let apiCall = await fetch(`http://localhost:7000/user/one`, request);
	let result = await apiCall;
	let response = await apiCall.json();
	console.log(response, result);

	if (response.status === 200) {
		response.forEach((user) => {
			main.innerHTML += `
        <div
				class="flex flex-col justify-center items-center w-1/2 max-w-lg my-10 bg-white rounded-lg shadow-lg p-5"
			>
				<img
					class="w-32 h-32 rounded-full mx-auto"
					src="${user.photo}"
					alt="Profile picture"
				/>
				<h2 class="text-center text-2xl font-semibold mt-3">
					${user.name}
				</h2>
				<p class="text-center text-gray-600 mt-1">John Doe</p>
			</div>
        `;
		});
	} else {
		alert("Server error");
	}
}

getMyProfile();
