import express, { Router } from "express";
import dashboardRoutes from "./dashboard.routes";

const router: Router = express.Router();

// Use dashboard router
router.use("/dashboard", dashboardRoutes);

export default router;
