let main = document.querySelector("main");
let jwt = window.sessionStorage.getItem("jwt");
let role = window.sessionStorage.getItem("role");
let followBtn = document.querySelectorAll(".followBtn");
let createPost = document.querySelector(".createPost");
let likeNumber = document.querySelectorAll(".likeNumber").value;

async function getAllListings() {
	let apiCall = await fetch("http://localhost:7000/listing/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((listing) => {
		main.innerHTML += `
			<div class="flex items-center justify-center min-h-fit max-h-72">
				<article class="border-2 border-sky-500 rounded-xl border p-5 shadow-md w-9/12 bg-white">
					<div
						class="flex w-full items-center justify-between border-b pb-3"
					>
						<div class="flex items-center space-x-3">
							<img
							src="${listing.photo}"
								class="h-16 w-16 rounded-full bg-slate-400"
							>
							<div class="text-lg font-bold text-slate-700">
								${listing.name}
							</div>
						</div>
						<div class="flex items-center space-x-8">
							<button
								class="bg-sky-500 text-white px-2.5 py-1.5 rounded-md followBtn"
							>
								<i class="fa-solid fa-user-plus" style="color: #ffffff;"></i> Follow
							</button>
						</div>
					</div>

					<div class="mt-4 mb-6">
						<div class="mb-3 text-xl font-bold">
							${listing.title}
						</div>
						<div class="text-sm text-neutral-600">
							${listing.text}
						</div>
					</div>

					
						<div class="flex items-center justify-between text-slate-500">
							<div class="flex space-x-4 md:space-x-8">
								<button onclick="showComments()"
									class="flex gap-2.5 cursor-pointer items-center transition hover:text-slate-800"
								>
									<i class="fa-solid fa-comment"></i>
									<span>${listing.comment_number}</span>
								</button>
								<div
									class="flex cursor-pointer items-center transition hover:text-slate-600"
								>
									<div class="divide-x flex flex-row w-48 max-w-fit justify-between items-center">
										<button
											class="min-w-32 max-w-fit text-white bg-green-700 border-2 rounded-lg p-2"
											onclick="likeContent('${listing._id}')"
										>
											<i class="fa-solid fa-thumbs-up" style="color: #ffffff;"></i>
												<span class="likeNumber">${listing.like_number}</span>
										</button>
										<button 
											class="min-w-32 max-w-fit text-white bg-red-600 border-4 rounded-lg p-2"
											onclick="dislikeContent('${listing._id}')"
										>
											<i class="fa-solid fa-thumbs-down" style="color: #ffffff;"></i>
												<span>${listing.dislike_number}</span>

										</button>

									</div>
								</div>
							</div>
						</div>
							<aside 
							class="flex flex-col gap-8 pt-14 pb-14 items-center justify-center bg-slate-900 w-full min-h-fit max-h-64 overflow-x-auto rounded-md hidden"
							>
							</aside>
				</article>
			</div>
	`;
	});
}

getAllListings();

async function getAllComments() {
	let aside = document.querySelector("aside");
	let apiCall = await fetch("http://localhost:7000/comment/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((comment) => {
		aside.innerHTML += `
		<div class="bg-slate-50 min h-32 w-11/12 rounded-lg">
			<img class="rounded-full w-32 border-2 border-sky-500"
				src="${comment.photo}">
			</img>
				<h2>${comment.username}</h2>
					<p>${comment.message}</p>
		</div>
		`;
	});
}

async function showComments() {
	let aside = document.querySelector("aside");
	aside.classList.toggle("hidden");
	getAllComments();
}

function handleDisconnect() {
	window.sessionStorage.clear(jwt);
	window.sessionStorage.clear(role);
	setTimeout(() => {
		window.location.href = "../INDEX/index.html";
	}, 1000);
}

function handleCreatePost() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.remove("hidden");
}

async function createListing() {
	let title = document.querySelector("#title").value;
	let text = document.querySelector("#text").value;
	let id_user = jwt.id_user;
	let like_number = 0;

	let listing = {
		title: title,
		text: text,
		like_number: like_number,
		id_user: id_user,
	};

	let request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(listing),
	};

	let apiRequest = fetch("http://localhost:7000/listing/create", request);
	let response = await apiRequest;
	console.log(response);
	if (response.status === 200) {
		console.log(response);
		alert("Listing created successfully");
		window.location.reload();
	} else {
		console.log(response);
		alert("Something went wrong...");
	}
}
function removeModal() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.add("hidden");
}

async function likeContent(id) {
	console.log(id);

	try {
		let request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${jwt}`,
			},
			// body: JSON.stringify(id),
		};
		let apiRequest = await fetch(
			`http://localhost:7000/listing/like/${id}`,
			request
		);
		let response = await apiRequest.json();
		console.log(response, apiRequest);
		// const xhttp = new XMLHttpRequest();
		// xhttp.onload = function () {
		// 	likeNumber.innerText += 1;
		// };
		// xhttp.open("POST", apiRequest, true);
		// xhttp.send();
		// console.log(xhttp);
	} catch (error) {
		console.log(error.stack);
	}
}

async function dislikeContent(id) {
	console.log(id);

	try {
		let request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${jwt}`,
			},
			// body: JSON.stringify(id),
		};
		let apiRequest = await fetch(
			`http://localhost:7000/listing/dislike/${id}`,
			request
		);
		let response = await apiRequest.json();
		console.log(response, apiRequest);
	} catch (error) {
		console.log(error.stack);
	}
}
