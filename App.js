/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useRef, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BeaconsManager from 'react-native-beacons-manager';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [region] = useState({
    identifier: 'AprilBrother',
    uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
    major: 1,
  });

  useEffect(() => {
    console.log('BeaconManager: App mounted');
    console.log('BeaconManager: Region', region);

    BeaconsManager.isStarted().then(started => {
      console.log('Beacon ranging started?', started);
      if (!started) {
        if (Platform.OS === 'ios') {
          BeaconsManager.startMonitoringForRegion(region);
          BeaconsManager.startUpdatingLocation();
        } else {
          BeaconsManager.startBeaconServices(region);
          BeaconsManager.setBackgroundScanPeriod(30000);
          BeaconsManager.setForegroundScanPeriod(30000);
        }
      }
    });

    // if (Platform.OS === 'ios') {
    //   BeaconsManager.startMonitoringForRegion(region);
    //   BeaconsManager.startUpdatingLocation();
    // } else {

    // }
  }, [region]);

  useEffect(() => {
    console.log('BeaconManager: App mounted');
    console.log('BeaconManager: Start Listeners');

    const beaconsDidRange = data => {
      console.log('BeaconManager: beaconsDidRange()', data);
      const beacons = Array.isArray(data.beacons)
        ? data.beacons
        : JSON.parse(data.beacons);

      console.log('BeaconManager: all beacons', beacons);
    };

    const onRegionDidEnter = () => {
      console.log('BeaconManager: onRegionDidEnter()');
    };
    const onRegionDidExit = () => {
      console.log('BeaconManager: onRegionDidExit()');
    };

    BeaconsManager.isStarted().then(started => {
      console.log('Beacon ranging started?', started);
      if (!started) {
        const beaconEventListener = BeaconsManager.BeaconsEventEmitter.addListener(
          'beaconsDidRange',
          beaconsDidRange,
        );

        const regionDidEnter = BeaconsManager.BeaconsEventEmitter.addListener(
          'regionDidEnter',
          onRegionDidEnter,
        );

        const regionDidExit = BeaconsManager.BeaconsEventEmitter.addListener(
          'regionDidExit',
          onRegionDidExit,
        );
      }
    });

    return () => {
      console.log('BeaconManager: App unmount');
      // console.log('BeaconManager: Remove Listeners');
      // beaconEventListener.remove();
      // regionDidEnter.remove();
      // regionDidExit.remove();
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
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
