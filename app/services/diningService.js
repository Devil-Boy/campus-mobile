const AppSettings = require('../AppSettings');

const DiningService = {
	FetchDining() {
		return fetch(AppSettings.DINING_API_URL, {
			headers: {
				'Cache-Control': 'no-cache'
			}
		})
		.then((response) => (response.json()))
		.then((data) => {
			if (data.errorMessage) {
				throw (data.errorMessage);
			} else {
				return data.GetDiningInfoResult;
			}
		});
	}
};

export default DiningService;
