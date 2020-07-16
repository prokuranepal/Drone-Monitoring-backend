# Drone Monitoring System

---

Drone Monitoring System(DMS) is a nodejs based system. It stores, manages and update to the detail or status of drone and also communicate control signals. The [frontend](https://github.com/prokuranepal/DMS_React) of the project is present in the github.

----

### Requirements

1. node(v13.6.0)
2. npm(v6.13.4)
3. mongodb(v3.4.23) or higher 
4. [nvm](https://github.com/nvm-sh/nvm) (optional)

----

### Configuration

A file name [config.js](config.js) contains all the configuration required for the code to function properly.

You can configure following field

    1. 'secretKey': 'youcankeepanyvalue' // which is used to create password hash
    2. 'whitelist' : ['http://localhost:3000'] // white listing the url so that only provided url frontend can communicate
    3. 'mongoUrl': 'mongodb://localhost:27017/inventory' // mongodb url

----

### How to Run 

1. Clone the project.
2. Move towards the directory of the cloned project.
3. Install the package using package manager npm.

    ```bash
    $ npm install
    ```

4. Configure the [project](#configuration).
5. Start the project using.

    ```bash
    $ npm start
    ```

6. Now the project will be running on http://localhost:3000. You can use [postman](https://www.postman.com/) or other software to communicate.

----

### Folder/File structure

    .
    ├── bin
    |   ├── www
    ├── models
    |   ├── db.js
    |   ├── drone.js
    |   ├── healthpost.js
    |   ├── hospital.js
    |   ├── mission.js
    |   └── users.js
    ├── node_modules
    ├── public
    |   ├── stylesheets
    |   |   └──style.css
    ├── routes
    |   ├── cors.js
    |   ├── dashboard.js
    |   ├── droneRouter.js
    |   ├── hospitalRouter.js
    |   ├── index.js
    |   ├── missionRouter.js
    |   └── userRouter.js
    ├── views
    |   ├── error.jade
    |   ├── index.jade
    |   └── layout.jade
    ├── .gitignore
    ├── .nvmrc
    ├── app.js
    ├── authenticate.js
    ├── config.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

----

### Explanation of folder structure

1. bin - It contains a executable file([www](bin/www)) which start the server in port 3000 or port provided in environmental variable (PORT). And also sets up the basic error handling. Rarely need to be taken in account.

2. models - This folder contains the scheme of requried models.

3. public - This folder contains the file which is accessible to the user when they are connected from the website. Like javascript, css, images and other assets. We don't need this folder because we are hadling all the request and response in JSON format.

4. routes - This is the folder where all the routes are kept.

5. views - This is the folder where we kept all the templating engine files. Express looks into it when rendering the view. We don't need this folder because we are hadling all the request and response in JSON format.

6. .gitignore - Files to be ignored for git.

7. .nvmrc - Node version defined here and can be used by nvm by command (nvm use) from terminal.

8. app.js - This file sets up all the functionality required for the application to work properly.

9. authenticate.js - This file contains all the authentication strategy and initilization for authentication.

10. config.js - Configuration file. Every config variables to be defined here.