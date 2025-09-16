import {asynchandler} from "../utils/asynhandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {User} from "../models/user.model.js"
import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"







/* 

Input: text, postId, parentComment (optional)

Steps:
Verify req.user._id exists (author of comment).
Validate text and postId.
Fetch the post by postId — throw error if not found.
If parentComment exists, validate it’s a valid comment.
Create comment with fields: post, user, text, parentComment || null.
Increment post.commentCount and save post.
Return created comment and updated commentCount.

*/
const createComment = asynchandler(async(req, res) => {
    const { text, parentComment, postId } = req.body
    const userId = req.user._id  // getting the id 
    
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(400, "user not  found")
    }

    if(!text){
        throw new ApiError(400, "comment text is required")
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError(400, "post not found")
    }

    const comment = await Comment.create({
        post: postId,
        user: userId,
        text,
        parentComment: parentComment || null

    })
    post.commentCount += 1;
    await post.save()


    if(!comment){
        throw new ApiError(500, "comment not created")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { 
                comment,
                commentCount:post.commentCount
            },
            "comment generate successfully"
        )
    )
})

/*
Input: postId from URL params
Steps:

Validate postId.
Fetch post by postId — throw error if not found.
Fetch all comments where post = postId.
Optionally populate user info (username, email).
Sort by createdAt descending (or ascending depending on UI).
Return comment list.
 */

const getCommentByPost = asynchandler(async(req, res) => {
    const { postId } = req.params  // geting the post id from the url

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(404, "post not found: ")
    }
    // fetch the comment for this post 
    const comments = await Comment.find({post : postId}).populate("user", "username email").sort({createdAt : -1})  //populating with user of username and email and sorting with the latest comment

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            comments, 
            "comment fetched successfully"
        )
    )

})

/*
Input: commentId from params, text from body
Steps:

Validate commentId and text.

Fetch comment by commentId.

Check comment.user._id === req.user._id — only author can update.

Update comment text and save.

Optionally populate user info for response.

Return updated comment.
*/ 

const updateComment = asynchandler(async(req, res) => {
    const { commentId } = req.params
    const { text } = req.body
    if(!commentId){
        throw new ApiError(400, "commentid not found for update")
    }
    if(!text){
        throw new ApiError(400, "text not found to update")
    }

    const comment  = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400, "comment not found")
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.text = text.trim();
    await comment.save();
 
    await comment.populate("user", "username email")  //populate user for the response

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );
})

/*
Input: commentId from params
Steps:

Validate commentId.

Fetch comment by commentId.

Check comment.user._id === req.user._id — only author can delete.

Decrement post.commentCount by 1 and save post.

Delete comment.

Return success message.

*/

const deleteComment = asynchandler(async(req, res) => {
    const { commentId } = req.params
    if(!commentId){
        throw new ApiError(400, "commentId is not found")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400, "comment is not found")
    }
     if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });


    await comment.deleteOne()

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "comment deleted successfully "
        )
    )
})

/* 

Input: commentId from params
Steps:

Validate commentId and req.user._id.

Fetch comment by commentId.

Check if req.user._id exists in comment.likes array:

If yes → remove userId (unlike)

If no → add userId (like)

Update comment.likeCount = comment.likes.length.

Save comment.

Return updated likes array and count, with message “liked” or “unliked”.
*/

const likeComment = asynchandler(async(req, res) => {
    const { commentId } = req.params
    const  userId  = req.user._id

    if(!commentId){
        throw new ApiError(400, "commentId not found")
    }
    if(!userId){
        throw new ApiError(400, "userId not found")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400, "comment is not found")
    }

    let message;  // checking if the user is already added the comentlike
    if(comment.likes.includes(userId.toString())){  //Always convert _id to string when comparing MongoDB ObjectIds:
        //unlike
        comment.likes.pull(userId)
        message = " comment is unliked"
    }else{
        comment.likes.push(userId)
        message = "comment is liked"
    }

    comment.likeCount = comment.likes.length;
    await comment.save()

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                likeCount: comment.likeCount,
                likes: comment.likes
            },
           message

        )
    )
})


/* 
Input: postId from params, text, parentComment from body
Steps:

Validate postId, text, parentComment.

Validate req.user._id exists.

Fetch post and parent comment — throw error if either not found.

Create comment with parentComment set.

Increment post’s commentCount and save.

Return created reply comment.
*/

const replyComment = asynchandler(async(req, res) => {
    const { text, parentComment } = req.body
    const {postId} =req.params
    const userId = req.user._id
    if(!userId){
        throw new ApiError(400, "userid is not found")
    }

    if(!text){
        throw new ApiError(400,"text is required to reply")
    }
    if(!parentComment){
        throw new ApiError(400,"parentcomment is required to reply")
    }
    if(!postId){
        throw new ApiError("postid is not found")
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(400, "post is not found")
    }
    
    const parent = await Comment.findById(parentComment)
    if(!parent){
        throw new ApiError(400, "parent not found")
    }

    const reply = await Comment.create({ 
        post : postId,
        user: userId,
        text,
        parentComment
    })

    post.commentCount += 1;
    await post.save()

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            reply,
            "reply comment is generated successfully"
        )
    )
})


export {
    createComment,
    getCommentByPost,
    updateComment,
    deleteComment,
    likeComment,
    replyComment

}