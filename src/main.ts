import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const { PORT: port } = process.env;

app.get('/', (req, res) => {
  res.send(`Welcome to the NASH API (v${process.env.npm_package_version ?? '1.0.0'})`);
});

app.listen(port, () => {
  console.log(`CRUD API listening on port ${port}`);
});
