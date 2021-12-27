import { Server } from "@hapi/hapi";
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
// import { User } from "../src/routers/user-routes";

import { init } from "../src/server/server";

// const testUser: User = {
// 	username: "Jovan",
// 	age: 26,
// 	email: "jovan@codebehind.rs",
// 	password: "jovan123",
// 	repeatPassword: "jovan123",
// };

// const testUserTwo: User = {
// 	username: "Jovan",
// 	age: 26,
// 	email: "jovan1@codebehind.rs",
// 	password: "jovan123",
// 	repeatPassword: "jovan123",
// };
const testUser = {
	username: "Jovan",
	age: 26,
	email: "jovan@codebehind.rs",
	password: "jovan123",
	repeatPassword: "jovan123",
};

const testUserTwo = {
	username: "Jovan",
	age: 26,
	email: "jovan1@codebehind.rs",
	password: "jovan123",
	repeatPassword: "jovan123",
};

describe("working with users", async () => {
	let server: Server;

	beforeEach((done) => {
		init().then((s) => {
			server = s;
			done();
		});
	});

	afterEach((done) => {
		server.stop().then(() => done());
	});

	it("gets all users", async () => {
		const res = await server.inject({
			method: "get",
			url: "/users",
		});

		expect(res.statusCode).to.equal(200);
		expect(res.result).to.not.be.null;
	});

	it("gets user by id", async () => {
		const res = await server.inject({
			method: "get",
			url: "/users/61c5f9469f18ff4ab06ef51b",
		});
		expect(res.statusCode).to.equal(200);
		expect(res.result).to.not.be.null;
	});

	it("update user", async () => {
		const res = await server.inject({
			method: "patch",
			url: "/users/61c5f9469f18ff4ab06ef51b",
		});

		expect(res.statusCode).to.equal(200);
	});

	it("signup user", async () => {
		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: testUser,
		});

		expect(res.statusCode).to.equal(201);
	});

	it("login user", async () => {
		await server.inject({
			method: "post",
			url: "/signup",
			payload: testUserTwo,
		});
		const res = await server.inject({
			method: "post",
			url: "/login",
			payload: testUserTwo,
		});

		expect(res.statusCode).to.equal(200);
	});

	it("delete user by id", async () => {
		const res = await server.inject({
			method: "delete",
			url: "/users/61c716225659dddd81cbd5f0",
		});
		expect(res.statusCode).to.equal(200);
		expect(res.result.acknowledged).to.equal(true);
	});

	it("delete all users", async () => {
		const res = await server.inject({
			method: "delete",
			url: "/users",
		});

		expect(res.statusCode).to.equal(200);
	});
});
