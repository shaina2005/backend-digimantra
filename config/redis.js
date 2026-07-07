import IORedis from "ioredis";

export const redisconnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

redisconnection.on("connect", () => {
  console.log("Redis connected");
});

redisconnection.on("error", (err) => {
  console.log("Error connecting redis", err);
});
