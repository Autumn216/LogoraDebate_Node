# Logora

## Setup
* **Install [Node 14 LTS or greater](https://nodejs.org)**
* **Install [Yarn](https://yarnpkg.com/en/docs/install)** (Or use npm if you prefer)


## Installation
* Configure @logora as registered scope : `npm config set '@logora:registry' https://node.bit.cloud`
* Install bit :
  ```bash
  npm install @teambit/bvm --location=global
  bvm install
  ```
* Install required modules: `yarn install` (or `npm install`)
* Compile & link bit modules : `bit compile && bit link`


## Usage

### Client
* Build development version of app and watch for changes: `yarn start-dev`
* Build production version of app : `yarn prod:client`

### Server
* Build development version of app and watch for changes: `yarn dev:server`
* Build production version of app : `yarn prod:server`
* Launch API server : `yarn start`
* Check documentation : 'http://localhost:3000/docs'


## Test

* Run client tests : `yarn test`#   L o g o r a D e b a t e _ N o d e  
 