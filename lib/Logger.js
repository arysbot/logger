const PromClient = require("./PromClient");
const grpcUrl = require("@arys/grpc-url");
const winston = require("winston");
const GrpcTransport = require("@arys/winston-transport-grpc");

class Logger {
    constructor(opts = {}) {
        this.service = opts.service;
        this.promClient = new PromClient();
        this.loger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new GrpcTransport({
                    level: "info",
                    serverURL: grpcUrl("Logger"),
                    config: { "grpc.lb_policy_name": "round_robin" },
                    path: "./node_modules/@arys/protofiles/src/Logger.proto"
                })
            ]
        });
    }

    logRequest(requestName, uuid, code, latency, metadata = {}) {
        this.promClient.addGrpcRequest(this.service, requestName, code, latency, metadata);
        const loggerRequest = {
            level: "info",
            uuid,
            service: this.service,
            request: requestName,
            code,
            metadata
        };
        this.loger.log(loggerRequest);
    }
    logEvent(eventName, ...args) {
        this.promClient.addEvent(eventName, ...args);
    }
}

module.exports = Logger;
