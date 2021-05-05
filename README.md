# React Native Beacon Detection Example
This repository contains example using the library `react-native-beacons-manager` with my fork based on the origin https://github.com/MacKentoch/react-native-beacons-manager.

## Note:
This example code doesn't include the permission handler, i assume you granted permissions, enabled services for the app (Bluetooth, Location Service, Location Permission) 

## How to Run
Android Studio for Android and xCode for iOS.

## Background Mode (App killed)
### Android
I have added foreground service to android code so this example will work on Background Mode in android perfectly. Tested in Galaxy S8+, Android 9.
You will see a notification in Notification Centre, that can't be avoided due to how to keep the app running in background. The message can be changed in side native android code, it could be ported to React Native but not at this stage, this example just show the functionality.
### iOS



## Verify
### Android
Run `adb logcat` and filter the string `BeaconManager` to see the logs of the detected beacons. I'm using Windows so it will be `adb logcat | findstr BeaconManager`
### iOS
Open xCode > Windows > Devices and Simulator > Open Console then search for the string `BeaconManager`
