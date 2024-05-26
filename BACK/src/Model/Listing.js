//Modèle des postes
class Listing {
	constructor(
		title,
		text,
		comment_number,
		like_number,
		dislike_number,
		id_user,
		photo,
		name,
		createdAt
	) {
		this.title = title;
		this.text = text;
		this.comment_number = comment_number;
		this.like_number = like_number;
		this.dislike_number = dislike_number;
		this.id_user = id_user;
		this.photo = photo;
		this.name = name;
		this.createdAt = createdAt;
	}
}

//Exportation des modules
module.exports = { Listing };
