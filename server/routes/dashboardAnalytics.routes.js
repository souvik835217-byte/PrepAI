import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboardAnalytics.controller.js";

const router = express.Router();

router.get("/:firebaseUid", getDashboardAnalytics);

export default router;