//Fonction qui récupère tous les commentaires ---------------------------------------------------------------------------------------
async function getAllComments(id) {
	let aside = document.querySelector(`.aside${id}`);
	let apiCall = await fetch("http://localhost:7000/comment/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((comment) => {
		aside.innerHTML += `
				<article class="border-2 border-sky-500 min-h-32 max-h-fit rounded-xl p-5 shadow-md w-11/12 bg-white">
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

//TODO: Fonction pour créer commentaires--------------------------------------------------------------------------------------------
function createComment(id) {
	console.log(id);
	let postModal = document.querySelector(".postModal");
	postModal.classList.remove("hidden");
}
