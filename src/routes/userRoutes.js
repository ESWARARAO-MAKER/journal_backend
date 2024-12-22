import express from "express";
import { assignPermissionToRole, assingRoleToUser, createPermission, createRole, login, register } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/create-role", createRole);
router.post("/create-permission", createPermission);
router.put("/assign-role", assingRoleToUser);
router.put("/assign-permission", assignPermissionToRole);

export default router