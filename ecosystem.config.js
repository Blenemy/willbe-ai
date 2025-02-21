module.exports = {
    apps: [{
        name: "portal-next",
        namespace: "portal",
        script: "npm",
        args: "start",
        env: {
            NODE_ENV: "production",
            PORT: "3000",
        }
    }]
}