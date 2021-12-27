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
exports.userRoutes = exports.validate = void 0;
const userJoiSchema_1 = require("../validation/userJoiSchema");
const mongodb_1 = require("mongodb");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validate = (request, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = request.mongo.db.collection("userscollection").findOne({ email });
    if (!user) {
        return { credentials: null, isValid: false };
    }
    const isValid = bcryptjs_1.default.compare(password, user.password);
    const credentials = { id: user._id, username: user.username };
    return { isValid, credentials };
});
exports.validate = validate;
function getUsers(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result;
            if (!request.query.limit) {
                result = yield request.mongo.db.collection("userscollection").find().toArray();
            }
            else {
                if (!+request.query.limit) {
                    return h.response({ error: "Limit must be an integer" }).code(400);
                }
                result = yield request.mongo.db
                    .collection("userscollection")
                    .find()
                    .limit(+request.query.limit)
                    .toArray();
            }
            return h.response(result).code(200);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
function getUserById(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!mongodb_1.ObjectId.isValid(request.params.id)) {
                return h.response(`The id you have provided is invalid`).code(400);
            }
            const user = yield request.mongo.db
                .collection("userscollection")
                .findOne({ _id: new mongodb_1.ObjectId(request.params.id) });
            return h.response(user).code(200);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
function signupUser(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = yield userJoiSchema_1.userValidator.validate(request.payload);
            if (error) {
                return h.response(error.message).code(400);
            }
            const emailValidation = yield request.mongo.db.collection("userscollection").findOne({ email: value.email });
            if (emailValidation) {
                return h.response({ error: "Email already is use" }).code(400);
            }
            // NOTE Here i encrypted the password and removed the repeatPassword property so that it does not get stored on DB
            const hashedPassword = yield bcryptjs_1.default.hash(value.password, 8);
            value.password = hashedPassword;
            delete value.repeatPassword;
            const result = yield request.mongo.db.collection("userscollection").insertOne(value);
            return h.response(`User with id: ${result.insertedId} added to the database.`).code(201);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
function loginUser(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield request.mongo.db.collection("userscollection").findOne({ email: request.payload.email });
            if (!user) {
                return h.response({ error: "Login failed" }).code(400);
            }
            if (!(yield bcryptjs_1.default.compare(request.payload.password, user.password))) {
                return h.response({ error: "login failed" }).code(400);
            }
            return user;
        }
        catch (err) {
            console.error(err);
        }
    });
}
function updateUser(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!mongodb_1.ObjectId.isValid(request.params.id)) {
                return h.response(`The id you have provided is invalid`).code(400);
            }
            const result = yield request.mongo.db
                .collection("userscollection")
                .updateOne({ _id: new mongodb_1.ObjectId(request.params.id) }, { $set: Object.assign({}, request.payload) });
            return h.response(result).code(200);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
function deleteUserById(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!mongodb_1.ObjectId.isValid(request.params.id)) {
                return h.response(`The id you have provided is invalid`).code(400);
            }
            const result = yield request.mongo.db
                .collection("userscollection")
                .deleteOne({ _id: new mongodb_1.ObjectId(request.params.id) });
            return h.response(`${result.deleteCount} user removed from the database`).code(200);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
function deleteDatabase(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield request.mongo.db.collection("userscollection").deleteMany();
            return h.response(`${result.deletedCount} users removed from the database`).code(200);
        }
        catch (err) {
            console.error(err);
            return h.response(err).code(500);
        }
    });
}
exports.userRoutes = [
    { method: "GET", path: "/users", handler: getUsers },
    { method: "GET", path: "/users/{id}", handler: getUserById },
    { method: "POST", path: "/login", handler: loginUser },
    { method: "POST", path: "/signup", handler: signupUser },
    { method: "PATCH", path: "/users/{id}", handler: updateUser },
    { method: "DELETE", path: "/users/{id}", handler: deleteUserById },
    { method: "DELETE", path: "/users", handler: deleteDatabase },
];
