import express, { Router, Request, Response } from "express";
import dashboardRoutes from "./dashboard.routes";

const router: Router = express.Router();

// Use dashboard route
router.use("/dashboard", dashboardRoutes);

// Default route
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to SkyGeni API",
    version: "1.0.0",
  });
});

export default router;
