const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./db');
const auth = require('./routes/auth.route');
const task = require('./routes/task.route');

const app = express();

app.set("port", process.env.PORT || 4000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use('/api/auth', auth);
app.use('/api/task', task);

connectDB();

async function main() {
  await app.listen(app.get("port"));
  console.log(`Server on port ${app.get("port")}`);
}

main();