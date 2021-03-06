import {
	Animated,
	Easing,
	Platform,
	Linking,
	Dimensions,
} from 'react-native';

const dateFormat = require('dateformat');
const logger = require('./logger');

/**
 * A module containing general helper functions
 * @module util/general
 */
module.exports = {

	/**
	 * Gets whether or not the current platform the app is running on is IOS
	 * @function
	 * @returns {boolean} True if the platform is IOS, false otherwise
	 */
	platformIOS() {
		return Platform.OS === 'ios';
	},

	/**
	 * Gets whether or not the current platform the app is running on is Android
	 * @function
	 * @returns {boolean} True if the platform is Android, false otherwise
	 */
	platformAndroid() {
		return Platform.OS === 'android';
	},

	/**
	 * Gets the current platform ths app is running on
	 * @function
	 * @returns {string} The platform name
	 */
	getPlatform() {
		return Platform.OS;
	},

	/**
	 * Converts a numerical quantity from meters to miles
	 * @function
	 * @param {number} meters The quantity to convert
	 * @returns {number} The quantity now converted into miles
	 */
	convertMetersToMiles(meters) {
		return (meters / 1609.344);
	},

	/**
	 * Gets a string representation of a given quantity of miles (up to and including a single decimal place)
	 * @function
	 * @param {number} miles The quantity to convert to a string
	 * @returns {number} The miles quantity now as a string
	 */
	getDistanceMilesStr(miles) {
		return (miles.toFixed(1) + ' mi');
	},

	/**
	 * Attempts to open the provided URL for displaying to the user
	 * @function
	 * @param {string} url The URL to open
	 * @returns {boolean|undefined} If the URL cannot be opened, this logs to console. Otherwise, returns true.
	 * False can only be returned if the ability to open a URL changes between the check and the opening itself.
	 * @todo Develop a more explicit/consistent return for this method
	 */
	openURL(url) {
		Linking.canOpenURL(url).then(supported => {
			if (!supported) {
				logger.log('ERR: openURL: Unable to handle url: ' + url);
			} else {
				return Linking.openURL(url);
			}
		}).catch(err => logger.log('ERR: openURL: ' + err));
	},

	/**
	 * Gets the URL for obtaining directions to a given location via a given transportation method
	 * @function
	 * @param {string} method Can be "walk" or anything else. Anything else will result in a URL for driving.
	 * @param {string|number} stopLat The latitude of the destination
	 * @param {string|number} stopLon The longitude of the destination
	 * @return {string} A platform-specific URL for obtaining the directions
	 */
	getDirectionsURL(method, stopLat, stopLon) {
		let directionsURL;

		if (this.platformIOS()) {
			if (method === 'walk') {
				directionsURL = 'http://maps.apple.com/?saddr=Current%20Location&daddr=' + stopLat + ',' + stopLon + '&dirflg=w';
			} else {
				// Default to driving directions
				directionsURL = 'http://maps.apple.com/?saddr=Current%20Location&daddr=' + stopLat + ',' + stopLon + '&dirflg=d';
			}
		} else {
			if (method === 'walk') {
				// directionsURL = 'https://www.google.com/maps/dir/' + startLat + ',' + startLon + '/' + stopLat + ',' + stopLon + '/@' + startLat + ',' + startLon + ',18z/data=!4m2!4m1!3e1';
				directionsURL = 'https://maps.google.com/maps?saddr=Current+Location&daddr=' + stopLat + ',' + stopLon + '&dirflg=w';
			} else {
				// Default to driving directions
				directionsURL = 'https://maps.google.com/maps?saddr=Current+Location&daddr=' + stopLat + ',' + stopLon + '&dirflg=d';
			}
		}

		return directionsURL;
	},

	/**
	 * Attempts to redirect the device to its navigation app
	 * @function
	 * @param {string} method Currently not used, can be anything
	 * @param {string|number} destinationLat The destination's latitude
	 * @param {string|number} destinationLon The destination's longitude
	 */
	gotoNavigationApp(destinationLat, destinationLon) {
		const destinationURL = module.exports.getDirectionsURL('walk', destinationLat, destinationLon );
		module.exports.openURL(destinationURL);
	},

	/**
	 * Begins the app's reloading animation with specific parameters
	 * @function
	 * @param {View|Text|Image|Object} anim The animation to use
	 * @param {number} toVal The value to approach
	 * @param {number} duration The duration of the animation
	 */
	startReloadAnimation2(anim, toVal, duration) {
		Animated.timing(anim, { toValue: toVal, duration, easing: Easing.linear }).start();
	},

	/**
	 * Begins the app's reloading animation
	 * @function
	 * @param {View|Text|Image|Object} anim The animation to use
	 */
	startReloadAnimation(anim) {
		Animated.timing(anim, { toValue: 100, duration: 60000, easing: Easing.linear }).start();
	},

	/**
	 * Stops the specified reload animation
	 * @function
	 * @param {View|Text|Image|Object} anim The animation to stop
	 */
	stopReloadAnimation(anim) {
		Animated.timing(anim, { toValue: 0, duration: 0 }).start();
	},

	/**
	 * Rounds a number to the nearest integer
	 * As examples: 2.49 will be rounded down to 2, while 2.5 will be rounded up to 3
	 * @function
	 * @param {number} number The number to round
	 * @returns {number} The rounded number
	 */
	round(number) {
		return Math.round(number);
	},

	/**
	 * Gets the pixel-ratio-modifier needed for this device window
	 * The modifier is a ratio to be used for scaling GUI elements based on the default sizes
	 * @function
	 * @returns {number} The ratio of current window width vs the app's default width
	 * @todo The variable windowHeight is unused
	 */
	getPRM() {
		const windowWidth = Dimensions.get('window').width;
		const windowHeight = Dimensions.get('window').height;
		const appDefaultWidth = 414;
		return (windowWidth / appDefaultWidth);
	},

	/**
	 * Modifies the input value by the pixel-ration-modifier
	 * This can be used to scale a GUI element's size for the current device
	 * @function
	 * @param {number} num The number/size to scale
	 * @returns {number} The now-scaled number/size
	 * @todo This method could call this.getPRM() to prevent redundant code
	 */
	doPRM(num) {
		const windowWidth = Dimensions.get('window').width;
		const appDefaultWidth = 414;
		const prm = (windowWidth / appDefaultWidth);

		return Math.round(num * prm);
	},

	/**
	 * Gets the maximum width for a card occupying a screen/window
	 * @function
	 * @returns {number} The maximum width in pixels
	 */
	getMaxCardWidth() {
		const windowSize = Dimensions.get('window');
		const windowWidth = windowSize.width;

		return windowWidth - 2 - 12;
	},

	/**
	 * Gets the UCSD campus primary color in hexidecimal form
	 * @function
	 * @returns {string} The string "#182B49" which represents a dark blue color
	 */
	getCampusPrimary() {
		return '#182B49';
	},

	/**
	 * Gets the current timestamp in seconds
	 * @function
	 * @returns {number} The number of seconds since midnight Jan 1, 1970
	 */
	getCurrentTimestamp() {
		return Math.round(Date.now() / 1000);
	},

	/**
	 * Gets the current timestamp formatted as a string
	 * @function
	 * @returns {string} The current time formatted to "yyyymmdd"
	 */
	getTimestampNumeric() {
		return (dateFormat(Date.now(), 'yyyymmdd'));
	},

	/**
	 * Gets the current timestamp in a specified format
	 * @function
	 * @param {string} The format to use (e.g. "yyyymmdd")
	 * @returns {string} The formatted current time
	 */
	getTimestamp(format) {
		return (dateFormat(Date.now(), format));
	},

	/**
	 * Gets the current date
	 * @function
	 * @returns {number} The number of milliseconds since midnight Jan 1, 1970
	 */
	getDateNow() {
		return (Date.now());
	},

	/**
	 * Converts a time string provided in military form to AM-PM form
	 * @function
	 * @param {string} The time in military form
	 * @returns {string} The time in AM-PM form
	 */
	militaryToAMPM(time) {
		if (time) {
			let militaryTime = time.substring(0, 5).replace(':','');
			let militaryTimeHH,
				militaryTimeMM,
				militaryTimeAMPM;

			militaryTime = militaryTime.replace(/^0/,'');

			if (militaryTime.length === 3) {
				militaryTimeHH = militaryTime.substring(0,1);
				militaryTimeMM = militaryTime.substring(1,3);
			} else if (militaryTime.length === 4) {
				militaryTimeHH = militaryTime.substring(0,2);
				militaryTimeMM = militaryTime.substring(2,4);
			}

			if (militaryTimeHH < 12) {
				militaryTimeAMPM = 'am';
			} else {
				militaryTimeAMPM = 'pm';
			}

			if (militaryTimeHH > 12) {
				militaryTimeHH -= 12;
			}

			if (militaryTimeHH === '0') {
				militaryTimeHH = '12';
			}

			if (militaryTimeMM === '00') {
				militaryTimeMM = '';
			}

			if (militaryTimeMM.length > 0) {
				return (militaryTimeHH + ':' + militaryTimeMM + militaryTimeAMPM);
			} else {
				return (militaryTimeHH + militaryTimeAMPM);
			}
		} else {
			return '';
		}
	},

	/**
	 * Gets an array containing random colors
	 * @function
	 * @param {number} length The length of the array to return
	 * @returns {number[]} An array with each element containing a randomly generated hex color code
	 */
	getRandomColorArray(length) {
		const randomColors = [];
		for (let i = 0; i < length; ++i) {
			randomColors.push(this.getRandomColor());
		}
		return randomColors;
	},

	/**
	 * Generates random color hex
	 * @function
	 * @returns {string} A randomly generated hex color code
	 */
	getRandomColor() {
		return '#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
	},

	/**
	 * Gets a linear sorting function based on a given property of the input objects
	 * @function
	 * @param {string} property The property the sorting function should concern itself with
	 * @returns {function} A sorting function that compares inputs based on one of their properties 
	 */
	dynamicSort(property) {
		return function(a, b) {
			return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		}
	},

	/**
	 * This is a comparison function used for sorting markers
	 * @function
	 * @param {Object} a The first marker to compare
	 * @param {number} a.distance The first distance
	 * @param {Object} b The second marker to compare
	 * @param {number} b.distance The second distance
	 * @return {number} -1 if a is less-than b, 0 if they are equal, 1 if a is greater-then b
	 * @todo This function is already handled by the one returned by dynamicSort()
	 */
	sortNearbyMarkers(a, b) {
		if (a.distance < b.distance) {
			return -1;
		} else if (a.distance > b.distance) {
			return 1;
		} else {
			return 0;
		}
	}
};
