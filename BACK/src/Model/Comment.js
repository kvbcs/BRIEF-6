class Comment {
	constructor(id_comment, message, id_listing, id_user) {
		this.id_comment = id_comment;
		this.message = message;
		this.id_listing = id_listing;
		this.id_user = id_user;
	}
}

module.exports = { Comment };
