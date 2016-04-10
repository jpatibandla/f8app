# Running the F8 UWP App

This guide contains instructions for building the UWP code for the F8 App

## Prerequisites

Assuming you have [Visual Studio 2015 Enterprise](\\products\PUBLIC\Products\Developers) installed, you will also need to have Windows 10 SDK installed. 

Clone this repo onto your local machine.
```
git clone https://github.com/CatalystCode/f8app.git
cd f8app
git fetch
git checkout Arlington
```
Install all the node dependencies, and then replace the react-native dependency with the React Native for UWP branch.
```
npm install
rd /s /q node_modules\react-native
git clone https://github.com/CatalystCode/react-native.git node_modules\react-native
pushd node_modules\react-native
git fetch
git checkout Cambridge
popd
```
We use the Cambridge branch of react-native, it has a few minor hacks to get things working properly that we'll straighten out later. No need to run npm install in the `node_modules\react-native` folder

Build your environment :

- Open up F8App.sln in Visual Studio 2015. The solution file can be found in windows\F8App\F8App.sln.
- If this is your first time using UWP, you will have to install the SDK. Right click on the solution file in the solution explorer and select the option labeled "Install Missing Components". You'll likely have to shutdown Visual Studio to continue the installation.
- You can start building the solution once all the packages are installed Build->Rebuild Solution. 

Run the F8 App:

- Run `react-native start` from the f8app Git root.
- Set the F8App project as your StartUp project in Visual Studio.
- Run the app on your targeted device in either Debug or Release configuration.

Bundle the F8 App:

- Run the bundle command
```
react-native bundle --platform windows --dev [true|false] --entry-file index.windows.js --bundle-output windows\F8App\ReactAssets\index.windows.bundle --assets-dest windows\F8App\ReactAssets
```
- Set the F8App project as your StartUp project in Visual Studio.
- Run the app on your targeted device in either DebugBundle or ReleaseBundle configuration.
