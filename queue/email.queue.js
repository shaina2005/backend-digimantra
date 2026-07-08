import { Queue } from "bullmq";
import { redisconnection } from "../config/redis.js";
import {addQueue, BullMQAdapter } from "../config/bullBoard.js"

export const emailQueue = new Queue("emailQueue" , {
    connection : redisconnection
})

addQueue(new BullMQAdapter(emailQueue));