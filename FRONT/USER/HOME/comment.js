//Fonction qui récupère tous les commentaires ---------------------------------------------------------------------------------------
async function getAllComments(id) {
	let aside = document.querySelector(`.aside${id}`);
	let apiCall = await fetch("http://localhost:7000/comment/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((comment) => {
		aside.innerHTML += `
			<article class="border-2 border-sky-500 h-fit rounded-xl p-5 shadow-md w-11/12 bg-white">
				<div
					class="flex w-full items-center justify-between border-b pb-3"
				>
					<div class="flex items-center space-x-3">
						<img
						src="${comment.photo}"
							class="h-16 w-16 rounded-full bg-slate-400"
						>
						<div class="text-lg font-bold text-slate-700">
							${comment.name}
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
					<div class="text-sm text-neutral-600">
						${comment.message}
					</div>
				</div>
			</article>
		`;
	});
}

//Fonction qui affiche les commentaires sous les postes ----------------------------------------------------------------------------
async function showComments(id) {
	console.log(id);
	let aside = document.querySelector(`.aside${id}`);
	aside.classList.toggle("hidden");
	getAllComments(id);
}

//Fonction pour créer commentaires--------------------------------------------------------------------------------------------
async function handleCreateComment(id) {
	console.log(id, "marche");
	let message = document.querySelector("#message").value;
	let id_user = jwt.id_user;
	let photo = jwt.photo;
	let id_listing = id;
	let name = jwt.name;
	console.log(id_listing);

	let comment = {
		message: message,
		id_listing: id_listing,
		id_user: id_user,
		photo: photo,
		name: name,
	};

	let request = {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${jwt}`,
		},
		body: JSON.stringify(comment),
	};

	let apiRequest = await fetch(
		`http://localhost:7000/comment/create/${id}`,
		request
	);
	let response = await apiRequest;
	let result = await response.json();
	if (response.status === 200) {
		console.log(result);
		alert("Comment created successfully");
		window.location.reload();
	} else {
		console.log(response);
		alert("Something went wrong...");
	}
}

//Fonction qui enlève la modal comment ---------------------------------------------------------------------------------------------
function removeModal() {
	let commentModal = document.querySelector(".commentModal");
	commentModal.classList.add("hidden");
}
