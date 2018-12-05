const PromClient = require("./PromClient");
const grpcUrl = require("@arys/grpc-url");
const winston = require("winston");
const GrpcTransport = require("@arys/winston-transport-grpc");

class Loger {
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

    logRequest(requestName, uuid, code, latency) {
        this.promClient.addGrpcRequest(this.service, requestName, code, latency);
        const loggerRequest = {
            level: "info",
            uuid,
            service: this.service,
            request: requestName,
            code
        };
        if(response.metadata) loggerRequest.metadata = response.metadata;
        this.loger.log(loggerRequest);
    }
    logEvent(eventName, id) {
        this.promClient.addEvent(eventName, id);
    }
}

module.exports = Loger;
