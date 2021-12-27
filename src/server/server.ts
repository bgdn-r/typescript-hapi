"use strict";

import Hapi from "@hapi/hapi";
import hapiBasic from "@hapi/basic";
import { Server } from "@hapi/hapi";
import { dbPlugin } from "../mongodb/database";
import { userRoutes, validate } from "../routers/user-routes";

export let server: Server;

export const init = async (): Promise<Server> => {
	server = Hapi.server({
		port: process.env.PORT || 3000,
		host: "localhost",
	});

	await server.register(hapiBasic);
	await server.register(dbPlugin);
	await server.auth.strategy("login", "basic", { validate });

	server.route(userRoutes);

	return server;
};

export const start = async (): Promise<void> => {
	console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
	return server.start();
};

process.on("unhandledRejection", (err) => {
	console.error("unhandledRejection");
	console.error(err);
	process.exit(1);
});
