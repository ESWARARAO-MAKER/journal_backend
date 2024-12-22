import express from "express";
import { submitManuscript } from "../controller/submitMenuScript.js";

const router =  express.Router();

router.post("/submit-menu-script", submitManuscript)
export default router;