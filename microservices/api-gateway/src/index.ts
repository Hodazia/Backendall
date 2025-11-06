import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  { router } from "./route"


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
