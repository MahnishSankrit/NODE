import "dotenv/config";
import express from "express";
import connectDB  from "../db/db.js";
import Todorouter from "../routes/task.routes.js";
import userRouter from "../routes/user.routes.js"
import postService from "../routes/post.routes.js"
import commentService from "../routes/comment.route.js"
import cors from "cors"


const app = express();
const corsOrigin = process.env.CORS_ORIGIN ||"https://todoblog.mahnish.me" || "http://localhost:5173";
//using the cors for my frontend 
app.use(cors({
    origin: corsOrigin,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use("/api/v1",Todorouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postService)
app.use("/api/v1/comments",commentService)


connectDB()
.then(() =>  {
    app.listen(process.env.PORT || 8000, () => {
        console.log("server is running on port :", process.env.PORT || 8000);
        
    })
})
.catch((error) => {
    console.log("moongoose connection is failed", error);
    
});

app.use((req, res, next) => {
    console.log("Request Body:", req.body);
    next();
});








export default app;


/*

Model → models/Task.js (you already did).

Controller → controllers/taskController.js (functions for CRUD).

Routes → routes/taskRoutes.js (map HTTP routes to controller functions).

Server → index.js (import routes & middleware).

*/
