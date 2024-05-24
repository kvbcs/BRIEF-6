class Comment {
	constructor(message, id_listing, id_user, photo) {
		this.message = message;
		this.id_listing = id_listing;
		this.id_user = id_user;
		this.photo = photo;
	}
}

module.exports = { Comment };
