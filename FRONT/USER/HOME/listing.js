let main = document.querySelector("main");
let jwt = window.sessionStorage.getItem("jwt");
let role = window.sessionStorage.getItem("role");
let followBtn = document.querySelectorAll(".followBtn");
let createPost = document.querySelector(".createPost");
let likeNumber = document.querySelectorAll(".likeNumber").value;

//Fonction déconnexion -------------------------------------------------------------------------------------------------------------
function handleDisconnect() {
	window.sessionStorage.clear(jwt);
	window.sessionStorage.clear(role);
	setTimeout(() => {
		window.location.href = "../../INDEX/index.html";
	}, 1000);
}

//Fonction qui récupère tous les postes ---------------------------------------------------------------------------------------------
async function getAllListings() {
	let apiCall = await fetch("http://localhost:7000/listing/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((listing) => {
		main.innerHTML += `
			<div class="flex items-center justify-center min-h-fit max-h-72 mb-10">
				<article class="border-2 border-sky-500 rounded-xl border p-5 shadow-md w-9/12 bg-white">
					<div
						class="flex w-full items-center justify-between border-b pb-3"
					>
						<div class="flex items-center space-x-3">
							<img
							src="http://localhost:7000/Uploads/${listing.photo}"
								class="h-16 w-16 rounded-full bg-slate-400"
							>
							<div class="text-lg font-bold text-slate-700">
								${listing.name}
							</div>
						</div>
						<div class="flex items-center space-x-8">
							<button
								onclick="follow('${listing._id}')"
								class="bg-sky-500 text-white px-2.5 py-1.5 rounded-md followBtn"
							>
								<i class="fa-solid fa-user-plus" style="color: #ffffff;"></i> 
								<span class="followText">Follow</span>
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
								<button onclick="showComments('${listing._id}')"
									class="flex gap-2.5 cursor-pointer items-center transition hover:text-slate-800"
								>
									<i class="fa-solid fa-comment"></i>
									<span>${listing.comment_number}</span>
								</button>
								<div
									class="flex cursor-pointer items-center transition hover:text-slate-600"
								>
									<div class="divide-x flex flex-row gap-3.5 w-48 max-w-fit justify-between items-center">
										<button
											class="min-w-32 max-w-fit text-white bg-green-700 hover:bg-green-900 rounded-lg p-2"
											onclick="likeContent('${listing._id}')"
										>
											<i class="fa-solid fa-thumbs-up" style="color: #ffffff;"></i>
												<span class="likeNumber('${listing._id}')">${listing.like_number}</span>
										</button>
										<button 
											class="btnComment min-w-32 max-w-fit text-white bg-red-600 hover:bg-red-800 rounded-lg p-2"
											onclick="dislikeContent('${listing._id}')"
										>
											<i class="fa-solid fa-thumbs-down" style="color: #ffffff;"></i>
												<span>${listing.dislike_number}</span>

										</button>
										<button 
											class="min-w-32 max-w-fit text-white bg-sky-500 hover:bg-sky-700 rounded-lg p-2"
											onclick="showCommentModal('${listing._id}')"
										>
											<i class="fa-solid fa-comment-dots" style="color: #ffffff;"></i>
												<span>Comment</span>
										</button>
									</div>
								</div>
							</div>
						</div>
							<aside 
							class="aside${listing._id} flex flex-col gap-8 pt-6 pb-14 mt-10 items-center justify-center bg-slate-900 w-full min-h-fit h-96 overflow-x-auto rounded-md hidden"
							>
								<h2 class="text-white m-10"> Loading Comments </h2>
							</aside>
				</article>
			</div>
	`;
	});
}

getAllListings();

//Fonction qui affiche la modal ----------------------------------------------------------------------------------------------------
function handleCreatePost() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.remove("hidden");
}

//Fonction qui enlève la modal -----------------------------------------------------------------------------------------------------
function removeModal() {
	let postModal = document.querySelector(".postModal");
	postModal.classList.add("hidden");
}
//Fonction création de postes ------------------------------------------------------------------------------------------------------
async function createListing() {
	let title = document.querySelector("#title").value;
	let text = document.querySelector("#text").value;
	let id_user = jwt.id_user;
	let photo;

	let listing = {
		title: title,
		text: text,
		id_user: id_user,
		photo: photo,
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

function follow(id) {
	console.log(id);
	followText.innerText = "Followed";
}

function showCommentModal(id) {
	console.log(id);
	let commentModal = document.querySelector(".commentModal");
	commentModal.classList.remove("hidden");
}
