import hapiMongo from "hapi-mongodb";
const MongoDBUrl = `mongodb+srv://username:password@cluster0.bedyg.mongodb.net/users?retryWrites=true&w=majority`;

export const dbPlugin = {
	plugin: hapiMongo,
	options: {
		url: MongoDBUrl,
		settings: {
			useUnifiedTopology: true,
		},
		decorate: true,
	},
};
