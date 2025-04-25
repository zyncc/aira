import arcjet, {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
    tokenBucket,
    validateEmail,
} from "@arcjet/next";

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
};

export default arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["ip.src"],
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // refill 5 tokens per interval
            interval: 10, // refill every 10 seconds
            capacity: 10, // bucket maximum capacity of 10 tokens
        }),
        validateEmail({
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],

        }),
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:MONITOR",
                "CATEGORY:PREVIEW",
            ],
        }),
        shield({
            mode: "LIVE",
        }),
    ],
});