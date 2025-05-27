import express, { Router } from "express"
// const express = require("express")
import {router} from "./routes/v1";

const app  = express();
app.use('/api/v1/', router)

app.listen(process.env.PORT || 3000)