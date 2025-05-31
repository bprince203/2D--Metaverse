import express, { Router } from "express"
// const express = require("express")
import {router} from "./routes/v1";

const app  = express();
app.use(express.json())
app.use('/api/v1/', router)

app.listen(process.env.PORT || 5432)