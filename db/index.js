const mongoose = require('mongoose');

require('dotenv').config();

const URI = process.env.MONGODB_URI
	? process.env.MONGODB_URI
	: "mongodb://localhost/dbtest";

const connectDB = async () => {
	const conn = await mongoose.connect(URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	console.log(`Mongo db connected on ${conn.connection.host}`);
}

module.exports = connectDB;