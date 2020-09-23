const API_KEY = process.env.API_KEY;

var auth = {

	checkApiKey: function(req, res, next) {

		var key;
		try {
			// console.log(req.headers);
			key = req.headers['authorization'].split(' ')[1];
			if (!key) {
				return res.status(400).end();
			} else {
				if (key != API_KEY) {
					return res.status(401).end();
				} else {
					return next();
				}
			}

		} catch (e) {
			return res.status(400).end();
		}

	}

}

module.exports = auth;