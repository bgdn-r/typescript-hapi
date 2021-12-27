import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";
import { userValidator } from "../validation/userJoiSchema";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export type User = {
	_id: ObjectId;
	username: string;
	age: number;
	email: string;
	password: string;
	repeatPassword?: string;
	tokens?: [{ token: string }];
};

export const validate = async (request: Request, email: string, password: string) => {
	const user = request.mongo.db.collection("userscollection").findOne({ email });
	if (!user) {
		return { credentials: null, isValid: false };
	}

	const isValid = bcrypt.compare(password, user.password);
	const credentials = { id: user._id, username: user.username };

	return { isValid, credentials };
};

async function getUsers(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		let result;
		if (!request.query.limit) {
			result = await request.mongo.db.collection("userscollection").find().toArray();
		} else {
			if (!+request.query.limit) {
				return h.response({ error: "Limit must be an integer" }).code(400);
			}
			result = await request.mongo.db
				.collection("userscollection")
				.find()
				.limit(+request.query.limit)
				.toArray();
		}
		return h.response(result).code(200);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

async function getUserById(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return h.response(`The id you have provided is invalid`).code(400);
		}

		const user = await request.mongo.db
			.collection("userscollection")
			.findOne({ _id: new ObjectId(request.params.id) });
		return h.response(user).code(200);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

async function signupUser(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		const { error, value } = await userValidator.validate(request.payload);

		if (error) {
			return h.response(error.message).code(400);
		}

		const emailValidation = await request.mongo.db.collection("userscollection").findOne({ email: value.email });
		if (emailValidation) {
			return h.response({ error: "Email already is use" }).code(400);
		}

		const hashedPassword: string = await bcrypt.hash(value.password, 8);
		value.password = hashedPassword;
		delete value.repeatPassword;

		const result = await request.mongo.db.collection("userscollection").insertOne(value);
		return h.response(`User with id: ${result.insertedId} added to the database.`).code(201);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

async function loginUser(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		const user = await request.mongo.db.collection("userscollection").findOne({ email: request.payload.email });

		if (!user) {
			return h.response({ error: "Login failed" }).code(400);
		}

		if (!(await bcrypt.compare(request.payload.password, user.password))) {
			return h.response({ error: "login failed" }).code(400);
		}

		return user;
	} catch (err) {
		console.error(err);
	}
}

async function updateUser(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return h.response(`The id you have provided is invalid`).code(400);
		}

		const result = await request.mongo.db
			.collection("userscollection")
			.updateOne({ _id: new ObjectId(request.params.id) }, { $set: { ...request.payload } });
		return h.response(result).code(200);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

async function deleteUserById(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		if (!ObjectId.isValid(request.params.id)) {
			return h.response(`The id you have provided is invalid`).code(400);
		}

		const result = await request.mongo.db
			.collection("userscollection")
			.deleteOne({ _id: new ObjectId(request.params.id) });
		return h.response(`${result.deleteCount} user removed from the database`).code(200);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

async function deleteDatabase(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
	try {
		const result = await request.mongo.db.collection("userscollection").deleteMany();
		return h.response(`${result.deletedCount} users removed from the database`).code(200);
	} catch (err) {
		console.error(err);
		return h.response(err).code(500);
	}
}

export const userRoutes: ServerRoute[] = [
	{ method: "GET", path: "/users", handler: getUsers },
	{ method: "GET", path: "/users/{id}", handler: getUserById },
	{ method: "POST", path: "/login", handler: loginUser },
	{ method: "POST", path: "/signup", handler: signupUser },
	{ method: "PATCH", path: "/users/{id}", handler: updateUser },
	{ method: "DELETE", path: "/users/{id}", handler: deleteUserById },
	{ method: "DELETE", path: "/users", handler: deleteDatabase },
];
