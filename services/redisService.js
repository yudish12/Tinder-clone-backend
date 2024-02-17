import Redis from "ioredis";


export const pub = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD,
})

export const sub = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD,
})