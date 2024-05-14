var validator = require("validator");

const verifData = async (req, res, next) => {
	const name = req.body.name;

	if (!validator.isAlpha(name)) {
		return res.json({ message: "Name must contain letters" });
	}

	req.name = name;
	next();
};

const verifUpdateUser = async (req, res, next) => {
	const id = req.params.id;
	const { name, photo, email, password } = req.body;
	let data = [];
	let values = [];
	if (name) {
		data.push("name= ?");
		values.push(name);
	}
	if (photo) {
		data.push("photo= ?");
		values.push(photo);
	}
	if (email) {
		data.push("email= ?");
		values.push(email);
	}
	if (password) {
		data.push("password= ?");
		values.push(password);
	}
	console.log(values);
	if (data.length == 0) {
		return res.json({ message: "No modification done" });
	}
	values.push(id);
	data = data.join(",");
	req.data = data;
	req.values = values;
	next();
};

const verifUpdateListing = async (req, res, next) => {
	const id = req.params.id;
	const { title, text } = req.body;
	let data = [];
	let values = [];
	if (title) {
		data.push("title= ?");
		values.push(title);
	}
	if (text) {
		data.push("text= ?");
		values.push(text);
	}
	console.log(values);
	if (data.length == 0) {
		return res.json({ message: "No modification done" });
	}
	values.push(id);
	data = data.join(",");
	req.data = data;
	req.values = values;
	next();
};

module.exports = { verifData, verifUpdateUser, verifUpdateListing };
