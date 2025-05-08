import express from "express";

const app = express();

//password logic

app.post("/hooks/catch/:userId/:zapId", (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;

  

})