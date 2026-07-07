import { Queue } from "bullmq";
import { redisconnection } from "../config/redis.js";

export const emailQueue = new Queue("emailQueue" , {
    connection : redisconnection
})