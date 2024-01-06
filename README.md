Nodejs application with basic functionalities like signup, message posting, feed, etc.

Steps to run this project:
1. Git clone this repo.
2. Switch to node version v18.18.0 as it was developed on this version.
3. Run the command "npm install"
4. Run the command "npm start"
5. As it is using in-memory storage so no need for a database here.
6. Open Postman and run using the following details:

Endpoints info:

1. POST http://localhost:3000/signup
   BODY:
   {
    "username":"saket",
    "password":"suraj"
}

2. POST http://localhost:3000/postMessage
   BODY
   {
    "username":"saket",
    "message":"Hello World 2"
}

3. POST http://localhost:3000/followUser (create one more user to follow)
   BODY
   {
    "username":"saket",
    "followUsername":"suraj"
}

4. GET http://localhost:3000/getMyFeed/saket
