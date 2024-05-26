let main = document.querySelector("main");
let jwt = window.sessionStorage.getItem("jwt");
console.log(jwt);

async function getMyListings() {
	let id_user = jwt.id_user;
	console.log(id_user);

	let request = {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${jwt}`,
		},
	};
	let apiCall = await fetch("http://localhost:7000/listing/mine");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((listing) => {
		main.innerHTML += `<div class="flex items-center justify-center min-h-fit max-h-52">
				<div class="rounded-xl border p-5 shadow-md w-9/12 bg-white">
					<div
						class="flex w-full items-center justify-between border-b pb-3"
					>
						<div class="flex items-center space-x-3">
							<img
								src="${listing.photo}"
								class="h-16 w-16 rounded-full bg-slate-400"
							/>
							<div class="text-lg font-bold text-slate-700">
								${listing.name}
							</div>
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

					<div>
						<div
							class="flex items-center justify-between text-slate-500"
						>
							<div class="flex space-x-4 md:space-x-8">
								<div
									class="flex gap-2.5 cursor-pointer items-center transition hover:text-slate-600"
								>
									<i class="fa-solid fa-comment"></i>
									<span>${listing.comment_number}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
	});
}

getMyListings();
