# Name of Project
Gnosis Safe Recovery using 3Box

## Project Description

The project leverages the security and composability of 3box to store a backup key made for the Gnosis Safe. 

There is No need to remember long mnemonics, Private Key or Question and Answers as all that user needs is a `Key` or `Password` to recover his/her precious assests. 

This app keeps the backup key in a safe 3Box confidenital space in encrypted form. This helps keeping the privacy and anonimity of user's key. 

Gnosis's Safe Contract Proxy Kit is Used to create a new safe for user and do all the transaction 

The project uses a safe and secure way to create a backup account which is responsible for adding the new Owner for Gnosis's Safe. This backup account has the access to Safe's ThreeBoxRecoveryModule that can add an owner to the safe.

The backup account's private key is stored encryted on 3Box's private space giving it a two layer security. It is to make sure that the account that has the access to user's safe is secure and protected at all costs.

### Features 

- Create a New Safe using CPK
- Add Recovery Module and configure 3box
- Recovery Safe and set new owners
- Beautiful UI and consistent User Experience
- No Front-Running Attacks Possible
- Dual Security Level for Backup Account and ThreeBoxRecoveryModule

## Project Team
    
```
Mitrasish Mukherjee
@rekpero
```
```
Manank Patni
@manankpatni
```

## A prototype (code or no-code)
https://gitlab.com/ethifylabs/gnosisthreeboxrecovery/
## Github Repo
https://gitlab.com/ethifylabs/gnosisthreeboxrecovery/
## Video Demo
https://youtu.be/-CtyWcxmqvE

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
