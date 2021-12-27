import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema({
	username: { type: String, required: true, trim: true },
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		validate (value) {
			const result = Joi.attempt(value,Joi.string().email())
		},
	},
});
