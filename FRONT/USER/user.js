console.log("alo");

let main = document.querySelector("main");
let jwt = window.sessionStorage.getItem("jwt");

async function getAllListings() {
	let apiCall = await fetch("http://localhost:7000/listing/all");
	let response = await apiCall.json();
	console.log(response);

	response.forEach((listing) => {
		main.innerHTML += `<div class="listing"> 
        <div class="listing-info">
                <div class="listing-user">

        <img src="${listing.photo}"/> 
        <h3>${listing.name}</h3>  
        </div>
        <button>Follow</button>
        </div>
		<div class="listing-text">
                <h3>${listing.title}</h3>  

        <p>${listing.text}</p>
		</div>
        </div>
	`;
	});
}

getAllListings();

function disconnectButton() {
	window.sessionStorage.clear(jwt);
	setTimeout(() => {
		window.location.href = "../INDEX/index.html";
	}, 1000);
}
