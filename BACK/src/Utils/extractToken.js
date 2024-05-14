async function extractToken(req) {
	const headerWithToken = req.headers.authorization;
	if (typeof headerWithToken !== undefined || headerWithToken) {
		const bearer = headerWithToken.split(" ");
		const token = bearer[1];
		return token;
	}
}

module.exports = { extractToken };
