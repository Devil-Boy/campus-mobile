import React from 'react';
import {
	Switch,
	View,
	Text,
	StyleSheet,
	Dimensions,
	ListView,
	StatusBar,
	Platform
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';

import { doPRM, getPRM, getMaxCardWidth } from '../../util/general';

const deviceHeight = Dimensions.get('window').height;
const statusBarHeight = Platform.select({
	ios: 0,
	android: StatusBar.currentHeight,
});
const resultsDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const SearchShuttleMenu = ({ onToggle, toggles, shuttle_routes }) => (
	<ElevatedView
		style={styles.card_main}
		elevation={2}
	>
		<View style={styles.list_container}>
			{shuttle_routes ?
				(
					<MenuList
						shuttles={resultsDataSource.cloneWithRows(shuttle_routes)}
						onToggle={onToggle}
						toggles={toggles}
					/>
				) : (
					null
				)
			}
		</View>
	</ElevatedView>
);

const MenuList = ({ shuttles, onToggle, toggles }) => (
	<ListView
		dataSource={shuttles}
		renderRow={
			(row, sectionID, rowID) =>
				<MenuItem
					data={row}
					index={rowID}
					onToggle={onToggle}
					state={toggles[row.id]}
				/>
		}
	/>
);

const MenuItem = ({ data, index, onToggle, state }) => (
	<View style={styles.list_row}>
		<Text
			style={{ flex: 3 }}
		>
			{data.name.trim()}
		</Text>
		<View
			style={styles.switch_container}
		>
			<Switch
				onValueChange={(val) => onToggle(val, data.id)}
				value={state}
			/>
		</View>
	</View>
);

const navHeight = Platform.select({
	ios: 58,
	android: 44
});

// device - (statusBar + navHeight + searchBar + listPadding + tabBar)
const listHeight = deviceHeight - (statusBarHeight + navHeight + doPRM(44) + 16 + 40); // 18 + 64 + (44 * getPRM()));

const styles = StyleSheet.create({
	list_container: { width: getMaxCardWidth(), padding: 8, maxHeight: listHeight, },
	card_main: { top: Math.round(44 * getPRM()) + 6, backgroundColor: '#FFFFFF', margin: 6, alignItems: 'flex-start', justifyContent: 'center', },
	list_row: { alignItems: 'center', flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE', overflow: 'hidden',  },
	switch_container: { flex: 1, alignItems: 'flex-end' },
});

export default SearchShuttleMenu;
