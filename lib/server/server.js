"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = exports.server = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const basic_1 = __importDefault(require("@hapi/basic"));
const database_1 = require("../mongodb/database");
const user_routes_1 = require("../routers/user-routes");
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.server = hapi_1.default.server({
        port: process.env.PORT || 3000,
        host: "localhost",
    });
    yield exports.server.register(basic_1.default);
    yield exports.server.register(database_1.dbPlugin);
    yield exports.server.auth.strategy("login", "basic", { validate: user_routes_1.validate });
    exports.server.route(user_routes_1.userRoutes);
    return exports.server;
});
exports.init = init;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Listening on ${exports.server.settings.host}:${exports.server.settings.port}`);
    return exports.server.start();
});
exports.start = start;
process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});
