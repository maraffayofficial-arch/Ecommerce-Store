import express from "express"
import { subscribe } from "../controller/subscriber.js"

const subscriberRouter = express.Router()
subscriberRouter.post("/", subscribe)

export default subscriberRouter
