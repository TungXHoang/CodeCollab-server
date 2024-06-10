import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port =  8080;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening port ${port}`)
})