class Comment {
	constructor(message, id_listing, id_user, photo, name) {
		this.message = message;
		this.id_listing = id_listing;
		this.id_user = id_user;
		this.photo = photo;
		this.name = name;
	}
}

module.exports = { Comment };
