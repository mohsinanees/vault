const USER = require("os").userInfo().username

module.exports = {

    DEBUG: "DEBUG",
    WARN: "WARN",
    TP_ADDR: 'tcp://127.0.0.1:4004',
    BATCH_URL: 'http://127.0.0.1:8008/batches',
    log_dir: `/home/${USER}/logs`
}