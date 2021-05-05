/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import BeaconsManager from 'react-native-beacons-manager';

const {height} = Dimensions.get('window');

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const beaconEventListener = useRef(null);
  const regionDidEnter = useRef(null);
  const regionDidExit = useRef(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [region] = useState({
    identifier: 'AprilBrother',
    uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    major: 1,
  });

  const beaconsDidRange = useCallback(data => {
    console.log('BeaconManager: beaconsDidRange()', data);
    const beacons = Array.isArray(data.beacons)
      ? data.beacons
      : JSON.parse(data.beacons);

    console.log('BeaconManager: all beacons', beacons);
  }, []);

  const onRegionDidEnter = useCallback(() => {
    console.log('BeaconManager: onRegionDidEnter()');
  }, []);
  const onRegionDidExit = useCallback(() => {
    console.log('BeaconManager: onRegionDidExit()');
  }, []);

  const start = useCallback(() => {
    BeaconsManager.isStarted().then(started => {
      console.log('start() Beacon ranging started?', started);
      if (!started) {
        if (Platform.OS === 'ios') {
          BeaconsManager.startMonitoringForRegion(region);
          BeaconsManager.startUpdatingLocation();
        } else {
          BeaconsManager.startBeaconServices(region);
          BeaconsManager.setBackgroundScanPeriod(30000);
          BeaconsManager.setForegroundScanPeriod(30000);
        }

        beaconEventListener.current = BeaconsManager.BeaconsEventEmitter.addListener(
          'beaconsDidRange',
          beaconsDidRange,
        );

        regionDidEnter.current = BeaconsManager.BeaconsEventEmitter.addListener(
          'regionDidEnter',
          onRegionDidEnter,
        );

        regionDidExit.current = BeaconsManager.BeaconsEventEmitter.addListener(
          'regionDidExit',
          onRegionDidExit,
        );
      }
    });
  }, []);

  const stop = useCallback(() => {
    BeaconsManager.isStarted().then(started => {
      console.log('stop() Beacon ranging started?', started);
      if (started) {
        if (Platform.OS === 'ios') {
          BeaconsManager.stopMonitoringForRegion(region);
          BeaconsManager.stopRangingBeaconsInRegion(region);
          BeaconsManager.stopUpdatingLocation();
        } else {
          BeaconsManager.stopBeaconServices(region);
        }

        if (beaconEventListener.current) {
          beaconEventListener.current.remove();
        }
        if (regionDidEnter.current) {
          regionDidEnter.current.remove();
        }
        if (regionDidExit.current) {
          regionDidExit.current.remove();
        }
      }
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          padding: 40,
        }}>
        <TouchableOpacity
          onPress={start}
          style={{
            padding: 10,
            backgroundColor: '#ff1f1f',
            borderRadius: 10,
            width: '100%',
            marginBottom: 10,
          }}>
          <Text style={{textAlign: 'center'}}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={stop}
          style={{
            padding: 10,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            width: '100%',
          }}>
          <Text style={{textAlign: 'center'}}>Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
