# Vacation Planner

## Description

This project was made for the purpose of presenting as a coding test and example. The layout was made with MUI Joy library and the backend runs on [socket-actions](https://www.npmjs.com/package/socket-actions) using its tools to create an auto-syncing list of vacations. For the sake of simplicity this project does not have a database implementation and instead opts for storing all data in a single file called data.json that is created when necessary.

This project is separated in two modules:

- Next: It is used for server-side rendering and serving React with MUI to make things look nice. This module is an example usage of the Client class from [socket-actions](https://www.npmjs.com/package/socket-actions).
- Socket: This is the actual WebSocket implementation using the classes Socket and Action from [socket-actions](https://www.npmjs.com/package/socket-actions).

## Instalation

After downloading this git repository, you just have to navigate to its root folder and run this command to install all relevant packages for both development and execution:

```
npm run install:services
```

## Usage

You can either run both services in a single command:

```
npm run dev
```

Or have a terminal window for each by running the starting commands separately:

```
npm run dev:frontend

npm run dev:backend
```

Either way, the frontend will use the port 3000 and the backend will use the port 3001.

To see how things sync, just open two web browser tabs/pages of http://localhost:3000 and if everything works as expected you should see that both will always be in sync to any action taken in any of them.

There is no code for easy deploy since this project is currently not expected to run outside of development scope and has no real scalability in its current form.
