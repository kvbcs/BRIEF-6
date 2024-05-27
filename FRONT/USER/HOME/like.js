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
		let result = await apiRequest;
		let response = await apiRequest.json();

		if (result.status === 200) {
			console.log(response, apiRequest);
			alert("Post liked !");
			window.location.reload();
		} else {
			alert("Server error");
		}
	} catch (error) {
		alert("Server error");
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

		let result = await apiRequest;
		let response = await apiRequest.json();
		if (result.status === 200) {
			console.log(response, apiRequest);
			alert("Post disliked !");
			window.location.reload();
		} else {
			alert("Server error");
		}
	} catch (error) {
		alert("Server error");
		console.log(error.stack);
	}
}
