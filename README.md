# COM3504The-Intelligent-Web

## Setup

1. Go to the project directory
2. Run `npm install` to install the required packages
3. Make sure your mongoDB service is running on port `27017`
4. Make sure the database `com3504` is empty
5. Run `npm start` to strat up the server

## How to use

### Upload an image

1. Go to `Home` page
2. Click `Upload` button on the top-right corner
3. Fill-in informations
4. Select an upload method (URL/File/Camera) and confirm the image you want to upload
5. Click the `Submit` button
6. If succeed, you will then redirect to its `Join` page, you can then input a username and room number to start a annotation session

### Start a annotation session

1. Go to `Home` page
2. Find an image you like
3. Click `Join` button
4. Input your username and a Room number to start a new annotation session or join an existing room.

## Roadmap/TODO

 - [x] Users can upload images form URL/File/Camera
 - [x] Server store uploaded images to MongoDB
 - [x] Users can view all uploaded images
 - [x] Users can start an annotation session by selecting an image and choose a room number
 - [x] Users can chat within a room
 - [x] Users can draw on the image within a room
 - [ ] Chatting history can be stored in IndexedDB
 - [ ] Drawing history can be stored in IndexedDB
 - [ ] Offline experience with Service Worker
 - [ ] View room history
