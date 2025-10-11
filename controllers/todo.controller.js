
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynhandler.js";

const createTask = asynchandler(async(req, res) => {
    const {title, description} = req.body
    if(!title || !description) {
        throw new ApiError(400, "title and description are required")
    }

    const newTask = await Task.create(
        {
            title , 
            description,
            user: req.user._id //this will assosicated that the user is loggedin
        }
    )

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            newTask,
            "task, created successfully"
        )
    )
})

const getAllTask = asynchandler(async(req, res) => {
    const Tasks = await Task.find({user : req.user._id })
    if(!Tasks){
        throw new ApiError(404, "Task is not present")
    }


   return res.status(201).json(
    new ApiResponse(201, Tasks, "task fetched successfully")
)

})

const getTaskById = asynchandler(async(req,res) => {
   const {id} = req.params;
    const Tasks = await Task.findOne({_id: id, user: req.user._id})
    
    if(!Tasks){
        throw new ApiError(404, "this taks is not present");
    }

    return res.status(201)
    .json(
       new ApiResponse(
            201,
            Tasks,
            "tasks fetched successfully"
        )
    )
})

const UpdateTask = asynchandler(async(req, res) => {
    const {title, description, status} = req.body
    const {id} = req.params
    const Tasks = await Task.findOne({ _id: id, user: req.user._id });
    if(!Tasks){
        throw new ApiError(404, "task in not found")
    }
    if(title) Tasks.title = title
    if(description)Tasks.description = description
    if(status)Tasks.status = status

    await Tasks.save()
    
    return res.status(200)
    .json(
      new  ApiResponse(
            200,
            Tasks,
            "task updated successfully"
        )
    )
})

const deleteTask = asynchandler(async(req, res) => {
    const Tasks = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if(!Tasks){
        throw new ApiError(404, "task cannot be deleted cause not found")
    }

    return res.status(201)
    .json(
     new ApiResponse(
            201,
            null,
            "task is deleted"
        )
    )
    
})

const getmyTodos = asynchandler(async(req, res) => {
    
    const todos = await Task.find({user: req.user._id})
    if(!todos){
        return new ApiError(404, "todo cant fetched for you")
    }
    
    return res.status(201)
    .json(
        new ApiResponse(
            201,
            todos,
            "todos fetched successfully"
        )
    )

})

const getmytodo = asynchandler(async(req, res) => {
     const { id } = req.params
    const todo = await Task.findOne({ _id: id, user: req.user._id })
    if(!todo){
        throw new ApiError(404, "Todo not found or you do not have access")
    }
    return res.status(200).json(
        new ApiResponse(200, todo, "Todo fetched successfully")
    )
})

export {
    createTask,
    getAllTask,
     getTaskById,
     UpdateTask,
     deleteTask,
     getmyTodos,
     getmytodo

}