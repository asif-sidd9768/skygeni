import express, { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

const router: Router = express.Router();

// Dashboard routes
router.get("/", dashboardController.getDashboardData);
router.get("/stats", dashboardController.getStats);

export default router;
