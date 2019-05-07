// Libraries
const os = require("os");
const PromClient = require("prom-client");
// consts


const { register, Histogram } = PromClient;

class promClient {
    constructor() {
        this._client = PromClient;
        this.register = promClient.register;
        this.metrics = {};
        this.metrics.grpcRequests = new Histogram({
            name: "grpc_requests",
            help: "amount of requests sent over grpc",
            labelNames: ["service", "instance", "request", "code", "metadata"]
        });
        this.metrics.grpcLatency = new Histogram({
            name: "grpc_latency",
            help: "history of the grpc request-response time",
            labelNames: ["service", "instance", "request", "code"]
        });
        this.metrics.eventRate = new Histogram({
            name: "discord_event_rate",
            help: "amount of events the bot receives from all guilds at a given time",
            labelNames: ["event", "shard", "guild"]
        });
        this.grpcRequests = this.metrics.grpcRequests;
        this.grpcLatency = this.metrics.grpcLatency;
        this.eventRate = this.metrics.eventRate;
    }
    _addGrpcRequest(service, request, code, metadata) {
        this.grpcRequests.labels(service, os.hostname(), request, code, JSON.stringify(metadata)).observe(1);
    }
    _addGrpcLatency(service, request, code, latency) {
        this.grpcLatency.labels(service, os.hostname(), request, code).observe(latency);
    }
    addGrpcRequest(service, request, code, latency, metadata) {
        this._addGrpcRequest(service, request, code, metadata);
        this._addGrpcLatency(service, request, code, latency);
    }
    addEvent(event, shard, guild) {
        this.eventRate.labels(event, shard, guild).observe(1);
    }
}

module.exports = promClient;
