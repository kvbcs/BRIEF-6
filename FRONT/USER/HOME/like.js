//Fonction like -------------------------------------------------------------------------------------------------------------------
async function likeContent(id) {
	console.log(id);

	try {
		let request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${jwt}`,
			},
		};
		let apiRequest = await fetch(
			`http://localhost:7000/listing/like/${id}`,
			request
		);
		let response = await apiRequest.json();

		console.log(response, apiRequest);
	} catch (error) {
		console.log(error.stack);
	}
}

//Fonction dislike -------------------------------------------------------------------------------------------------------------------
async function dislikeContent(id) {
	console.log(id);

	try {
		let request = {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${jwt}`,
			},
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
