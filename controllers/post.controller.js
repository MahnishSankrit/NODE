
import { asynchandler } from "../utils/asynhandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { Post } from "../models/post.model.js"


/*
Input: title, content, tags, isPublished from req.body
Steps:
- Get userId from JWT (req.user)
- Validate required fields (title, content, tags)
- Normalize tags (lowercase & trim)
- Create post in DB with defaults (likes=[], commentCount=0, shares=0)
- Populate author info (username, email)
- Return created post
*/


const createPost = asynchandler(async(req, res) => {
    const { title, content, tags, isPublished  } = req.body
    const userId = req.user?._id // if user hai then give the id 
    if(!userId){
        throw new ApiError(400, "userid not found")
    }
    if(!title){
        throw new ApiError(400, "title is required for the post")
    }
    if(!content){
        throw new ApiError(400, "content is required")
    }
    if(!tags){
        throw new ApiError(400, "tags are required")
    }

    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(400, "user not found")
    }
    
    let normalizeTags = [];  // this is for handling the different tags given by the user so that no duplication can be their
    if (Array.isArray(tags)) {
        normalizeTags = tags.map((tag) => tag.trim().toLowerCase());
    }


    const post = await Post.create({
        title: title,
        content: content,
        author: userId,
        likes: [],
        isPublished: isPublished?? true,
        commentCount: 0,
        shares: 0,
        tags: normalizeTags
    })

    if(!post){
        throw new ApiError(400, "post not created something went wrong!")
    }

    await post.populate("author", "username email")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            post,
            "post created successfully"
        )
    )
})


/*
Input: page, limit, tags, author, sortby from req.query
Steps:
- Set default page=1, limit=10, sortby="createdAt"
- Build filter object: isPublished=true
- If tags provided, filter posts that match tags
- If author provided, filter posts by author
- Count total posts for pagination
- Calculate skip for pagination
- Fetch posts with filter, populate author info
- Sort, skip, and limit for pagination
- Return posts with meta info (totalPosts, totalPages, currentPage)
*/

const getallposts = asynchandler(async (req, res) => {
    // get query params from request (with default values)
    let { page = 1, limit = 10, tags, author, sortby = "createdAt" } = req.query;

    // convert page and limit to numbers (they come as strings from query)
    page = parseInt(page);
    limit = parseInt(limit);

    // base filter: only fetch published posts
    const filter = { isPublished: true };

    // if tags are given -> filter posts that have at least one of those tags
    if (tags) {
        filter.tags = {
            $in: tags.split(",").map((tag) => tag.trim().toLowerCase()),
        };
    }

    // if author is given -> filter posts of that author
    if (author) {
        filter.author = author;
    }

    // get total number of posts matching filter (for pagination info)
    const totalPosts = await Post.countDocuments(filter);

    // calculate how many documents to skip (based on current page)
    const skip = (page - 1) * limit;

    // fetch posts with conditions
    const posts = await Post.find(filter)
        .populate("author", "username email") // replace author id with username + email
        .sort({ [sortby]: -1 })               // sort by given field (default: createdAt) in descending order
        .skip(skip)                           // skip docs before current page
        .limit(limit);                        // limit docs per page

    // if no posts found, throw error
    if (!posts.length) {
        throw new ApiError(404, "No posts found");
    }

    // send response with meta info and posts
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalPosts,                          // total count of posts
                totalPages: Math.ceil(totalPosts / limit), // how many total pages
                currentPage: page,                   // which page we are on
                posts,                               // actual post data
            },
            "Posts fetched successfully"
        )
    );
});


/*
Input: postId from URL params
Steps:
- Validate postId
- Fetch post by postId
- Populate author info (username, email)
- Throw error if post not found
- Return the post
*/

const getPostById = asynchandler(async(req, res) =>{
    const { postId } = req.params
    if(!postId){
        throw new ApiError(400, "postid is not found ")
    }
    
    // finding post from the db
    const post = await Post.findById(postId)
    .populate("author", "username email")   // replacing the author details in the form of username or email

    if(!post){
        throw new ApiError(404, "post not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            post,
            "post fetched successfully using id"
        )
    )
     
})


/*
Input: postId from URL params, title/content/tags from req.body
Steps:
- Fetch post by postId
- Throw error if post not found
- Check if authenticated user is the author
- Update provided fields (title, content, tags)
- Save post
- Populate author info (username, email)
- Return updated post
*/

const updatePost = asynchandler(async(req, res) => {
    const {title, content,tags } = req.body
    if(!title){
        throw new ApiError(400, "title is not here to update")
    }
    if(!content){
        throw new ApiError(400, "content is not present")
    }
    const {postId} = req.params
    if(!postId){
        throw new ApiError(400, "postid is not found")
    }
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(400, "post is not present")
    }
    
    //now here i will update
    if(post.author.toString() !== req.user._id.toString()){
        throw new ApiError(400, "you are not authorized to upadate anything")
    }
  
    if(title) post.title = title.trim()
    if(content) post.content = content.trim()
    if(tags) post.tags = tags.map(tag => tag.trim().toLowerCase())    
        
    await post.save();

    await post.populate("author", "username email")

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            post,
            "post is updated successfully"
        )
    )
    
})


/*
Input: postId from URL params
Steps:
- Fetch post by postId
- Throw error if post not found
- Check if authenticated user is the author
- Delete the post (or soft delete if needed)
- Return success message
*/

const deletePost = asynchandler(async(req, res) => {
    const {postId} = req.params
    // checking for the postid 
    if(!postId){
        throw new ApiError(400, "postid is not found")
    }
    // finding the post 
    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(404, "post  is not found")
    }

    //  Authorization check (only author can delete)
    if(post.author.toString() !== req.user._id.toString()){
        throw new ApiError(400, "you are not authorized to delete this post")
    }
    // await Post.findByIdAndUpdate(
    //     post.author,
    //     {
    //         isPublished: false
    //     }
    // )

     // 4. Delete logic
    // Option A: Hard delete
    await post.deleteOne();

    // Option B (soft delete): 
    // post.isPublished = false;
    // await post.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            null,
            "post deleted successfully"
        )
    )
})


/*
Input: postId from URL params, userId from JWT
Steps:
- Fetch post by postId
- Throw error if post not found
- Check if user already liked the post
    - If yes, remove user from likes array (unlike)
    - If no, add userId to likes array (like)
- Save post
- Return updated like count and message
*/

const likePost = asynchandler(async(req, res) => {
    const {postId} = req.params
    const userId = req.user._id

    if(!postId){
        throw new ApiError(400, "postid is not exist")
    }
    if(!userId){
        throw new ApiError(400, "userid is not present")
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(400, "post not found")
    }

    // checking if the user is already like the post or not 
    let message
    if(post.likes.includes(userId.toString())){
        post.likes.pull(userId) // unlike
        message = "post is unliked"
    }else{
        post.likes.push(userId) // like
        message = "post is liked"
    }
    
     // updating the postliked count 
       post.likecount = post.likes.length; // optional field for easy count
    await post.save();

    // Return likes array AND count
    return res.status(200).json(
        new ApiResponse(200, {
            likes: post.likes,
            likecount: post.likes.length
        }, message)
    );
})

const getPostByUser = asynchandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400, "userId is not found")
    }
    const posts = await Post.find({author: userId}).populate("author", "username email")
    if(!posts.length){
        throw new ApiError(404, "no posts found for this user")
    }

    return res.status(200).json(
        new ApiResponse(200, posts, " user posts fetched successfully")
    );
})

const searchPosts = asynchandler(async (req, res) => {
    const { query } = req.query;
    if(!query){
        throw new ApiError(400, "search query is not found")
    }
    const posts = await Post.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
        ]
    }).populate("author", "username email");
    if(!posts.length){
        throw new ApiError(404, "no posts found")
    }

    return res.status(200).json(
        new ApiResponse(200, posts, "posts fetched successfully")
    );
})

export{
    createPost,
    getallposts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    getPostByUser,
    searchPosts
}