import React from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import TimerMixin from 'react-timer-mixin';
import MapView from 'react-native-maps';

import ShuttleSmallList from './ShuttleSmallList';
import { updateArrivals } from '../../actions/shuttle';
import ShuttleImageDict from './ShuttleImageDict';

const stopUpdateInterval = 6000;
const deviceWidth = Dimensions.get('window').width;

const css = require('../../styles/css');
const logger = require('../../util/logger');

const ShuttleStopContainer = React.createClass({
	mixins: [TimerMixin],

	componentDidMount() {
		logger.ga('View Mounted: Shuttle Stop');
		this.startShuttleWatch();
	},

	startShuttleWatch() {
		this.setInterval(
			this.tryUpdateStop,
			stopUpdateInterval
		);
	},

	tryUpdateStop() {
		const { stopID } = this.props;

		this.props.updateArrivals(stopID);
	},

	render() {
		const { stopID, stops } = this.props;

		return (
			<View style={[css.main_container, css.offwhitebg]}>

				<ScrollView
					contentContainerStyle={css.scroll_default}
				>
					{ShuttleImageDict[stopID] ? (
						<Image style={css.shuttlestop_image} source={ShuttleImageDict[stopID]} />
					) : null }

					<View style={css.shuttlestop_name_container}>
						<Text style={css.shuttlestop_name_text}>{stops[stopID].name}</Text>
					</View>

					{ (stops[stopID].arrivals) ? (
						<ShuttleSmallList
							arrivalData={stops[stopID].arrivals}
							style={{ width: deviceWidth }}
							rows={3}
							scrollEnabled={false}
						/>
					) : (
						<View style={css.shuttle_stop_arrivals_container}>
							<Text style={css.shuttle_stop_next_arrivals_text}>There are no active shuttles at this time</Text>
						</View>
					)}

					<View style={css.shuttle_stop_map_container}>
						<MapView
							style={css.shuttlestop_map}
							loadingEnabled={true}
							loadingIndicatorColor={'#666'}
							loadingBackgroundColor={'#EEE'}
							showsUserLocation={true}
							mapType={'standard'}
							initialRegion={{
								latitude: this.props.location.coords.latitude,
								longitude: this.props.location.coords.longitude,
								latitudeDelta: 0.1,
								longitudeDelta: 0.1,
							}}
						>
							<MapView.Marker
								coordinate={{ latitude: stops[stopID].lat,
									longitude: stops[stopID].lon }}
								title={stops[stopID].lat.name}
								description={stops[stopID].lat.name}
								key={stops[stopID].lat.name}
							/>
						</MapView>
					</View>
				</ScrollView>
			</View>

		);
	},

});

function mapStateToProps(state, props) {
	return {
		location: state.location.position,
		stops: state.shuttle.stops,
	};
}

const mapDispatchToProps = (dispatch) => (
	{
		updateArrivals: (stopID) => {
			dispatch(updateArrivals(stopID));
		}
	}
);

const ActualShuttleStop = connect(
	mapStateToProps,
	mapDispatchToProps
)(ShuttleStopContainer);

export default ActualShuttleStop;
