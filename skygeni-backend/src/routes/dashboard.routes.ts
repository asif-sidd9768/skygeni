import express, { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

const router: Router = express.Router();

// Dashboard router
router.get("/", dashboardController.getDashboardData);

export default router;
