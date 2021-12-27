"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userValidator = joi_1.default.object({
    username: joi_1.default.string().trim().required().messages({
        "any.required": "Error: Username is required",
        "string.empty": "Error: Username is required",
    }),
    age: joi_1.default.number().min(18).required().messages({
        "any.required": "Error: Please provide your age",
    }),
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: {
            allow: ["com", "rs"],
        },
    })
        .trim()
        .required()
        .messages({
        "any.required": "Error: Email is required",
        "string.email": "Error: Email you provided is invalid",
    }),
    password: joi_1.default.string().min(6).trim().required().messages({
        "any.required": "Error: Password is required",
        "string.min": "Error: Password must have at least 6 characters",
    }),
    repeatPassword: joi_1.default.string().trim().required().valid(joi_1.default.ref("password")).messages({
        "any.required": "Error: Password do not match",
        "any.only": "Error: Password do not match",
    }),
});
