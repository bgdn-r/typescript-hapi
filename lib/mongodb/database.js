"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPlugin = void 0;
const hapi_mongodb_1 = __importDefault(require("hapi-mongodb"));
const MongoDBUrl = `mongodb+srv://taskapp:codebehind1@cluster0.bedyg.mongodb.net/users?retryWrites=true&w=majority`;
exports.dbPlugin = {
    plugin: hapi_mongodb_1.default,
    options: {
        url: MongoDBUrl,
        settings: {
            useUnifiedTopology: true,
        },
        decorate: true,
    },
};
