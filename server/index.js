import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register, login } from '../server/controller/auth.js';
import { getUser, getUSerFriends, addRemoveFriend } from '../server/controller/users.js'
import { createPost, getFeedPosts, getUserPosts, likePost } from '../server/controller/post.js'
import { verifyToken } from './middleware/auth.js';
// import { authRoute } from './routes/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

/*Configuration  */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));



// //File Storage
// This code sets up file storage and file upload functionality using the Multer middleware in a Node.js application.

// Here's a breakdown of the code:

// The Storage constant is initialized as a diskStorage object provided by Multer. It configures the destination and filename for storing uploaded files.

// The destination property of Storage specifies the directory where uploaded files will be stored. In this case, it is set to "public/assets". This means that the uploaded files will be saved in the public/assets directory of the server.

// The filename property of Storage specifies the name of the uploaded file. In this case, it uses file.originalname, which represents the original name of the uploaded file. This ensures that the saved file will have the same name as the original file.

// The upload constant is initialized as a Multer middleware using the multer() function. It takes the Storage object as a configuration parameter. This sets up the middleware to handle file uploads and use the specified storage configuration.

// By using this code, you can handle file uploads in your Node.js application. When a file is uploaded, Multer will save it to the specified destination directory ("public/assets") with the original filename.







const Storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, res, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ Storage });

//Route with files
app.post("/auth/register", upload.single("picture"), register);
//Routes
app.use('/auth/login', login);
// app.use('/users', users);
app.get("/users/:id", verifyToken, getUser);
app.get("/users/:id/friends", verifyToken, getUSerFriends);
app.patch("/users/:id/:friendId", verifyToken, addRemoveFriend);

// import { createPost, getFeedPosts, getUserPosts, likePost } from '../server/controller/post.js'
app.post('/post/createPost', verifyToken, upload.single("picture"), createPost);
app.get('/post/getFeedPosts', verifyToken, getFeedPosts);
app.get('/post/getUserPosts', verifyToken, getUserPosts);
app.patch('/post/likePost', verifyToken, likePost);



//Mongooses setup
// const PORT = process.env.PORT || 9000;
// mongoose.connect("mongodb+srv://shaiki4071:irfu@soc.5x4f6pv.mongodb.net/?retryWrites=true&w=majority").then(() => {

// }).catch((err) => console.error(`${err} did not connect to mongodb server`));

const mongoDB = () => {


    mongoose.connect("mongodb+srv://shaiki4071:irfu@soc.5x4f6pv.mongodb.net/?retryWrites=true&w=majority").then(() => {

        console.log("MongoDB connected");

    }).catch((err) => console.error(`${err} did not connect to mongodb server`));

}
const PORT = process.env.PORT || 9000;
app.listen(PORT, (req, res) => {
    console.log(`server is up and running on port ${PORT}`);

    mongoDB();
    User.insertMany(users);
    Post.insertMany(posts);

});
app.get('/', (req, res) => {
    res.status(200).json(`Server is up and running on port ${PORT}`)
})


