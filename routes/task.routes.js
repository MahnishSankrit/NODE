
    import { Router } from "express";
    import { createTask, deleteTask, getAllTask, getTaskById, UpdateTask } from "../controllers/todo.controller.js"


    const router = Router()

    router.route("/tasks").post(createTask)
    router.route("/tasks").get(getAllTask)
    router.route("/tasks/:id").get(getTaskById)
    router.route("/tasks/:id").put(UpdateTask)
    router.route("/tasks/:id").delete(deleteTask)


export default router


// this restfull 