import { sendOtpMail } from "../helpers/sendMail.js";
import { Worker } from "bullmq";
import { redisconnection } from "../config/redis.js";


const emailWorker = new Worker(
    "emailQueue",
    async (job) => {

        console.log("Processing job:", job.id);

        console.log("Job data:", job.data);

        const { email, otp } = job.data;


        // Here you will call your email function
        await sendOtpMail(email, otp);


        console.log(
            `Sending OTP ${otp} to ${email}`
        );


        return {
            success: true,
            email,
        };
    },
    {
        connection: redisconnection,
    }
);


emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});


emailWorker.on("failed", (job, err) => {
    console.log(
        `Job ${job.id} failed`,
        err.message
    );
});