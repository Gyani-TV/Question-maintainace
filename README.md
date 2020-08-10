# express-firebase

Simple Employee Admin Server using NodeJS.

You used Mongo atlas for auth, realtime DB, and all. Finally you need your own server
to integrate with 3rd party services, or maybe custom token, or you need server-side operations.

## How to use
1. Clone this repo and change directory to the cloned folder
2. Install the packages

   ```sh
   npm install
   ```

3. You need to Download and start the mongo db instance or connect to the remote repository in mongo atlas
    ... currently we are only using the local mongodb innstance localhost:27017

```sh
sudo service mongod start
```

4. Copy `.env.example` file and rename it to `.env` at project root.

    Change the dummy FIREBASE_DATABASE_URL value with your Firebase project databaseURL, you can find it on your Firebase Console

5. Then start the server
    ```sh
    npm start
    ```
6. It should log successfully, and you can start using Firebase Admin SDK
7. For further reading, please visit [Express Setup](https://expressjs.com/)

## License
MIT

Copyright (c) 2016 Aloy A Sen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.