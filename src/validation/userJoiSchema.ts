import Joi from "joi";
import { Schema } from "joi";

export const userValidator: Schema = Joi.object({
	username: Joi.string().trim().required().messages({
		"any.required": "Error: Username is required",
		"string.empty": "Error: Username is required",
	}),
	age: Joi.number().min(18).required().messages({
		"any.required": "Error: Please provide your age",
	}),
	email: Joi.string()
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
	password: Joi.string().min(6).trim().required().messages({
		"any.required": "Error: Password is required",
		"string.min": "Error: Password must have at least 6 characters",
	}),
	repeatPassword: Joi.string().trim().required().valid(Joi.ref("password")).messages({
		"any.required": "Error: Password do not match",
		"any.only": "Error: Password do not match",
	}),
});
