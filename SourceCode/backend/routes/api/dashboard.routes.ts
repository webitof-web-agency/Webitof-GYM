import {
  getAdminDashboard,
  getAdminRevenueAnalytics,
  getAdminSalesAnalytics,
  getTrainerDashboard,
} from "../../controllers/dashboard.controller";
import { Router } from "express";
import { isAdminOrEmployee, isTrainer } from "../../middlewares/auth.middleware";

const dashboardRoutes = Router();

dashboardRoutes.get('/trainer', isTrainer, getTrainerDashboard)
dashboardRoutes.get('/admin', isAdminOrEmployee, getAdminDashboard)
dashboardRoutes.get('/admin/revenue-analytics', isAdminOrEmployee, getAdminRevenueAnalytics)
dashboardRoutes.get('/admin/sales-analytics', isAdminOrEmployee, getAdminSalesAnalytics)

export default dashboardRoutes;
