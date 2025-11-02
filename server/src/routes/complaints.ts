import { Router } from "express";
import {
  listComplaints,
  listAllComplaints,
  updateStatus,
  createComplaint,
  deleteComplaint,
  updateComplaint,
  getComplaint,
} from "../controllers/complaintsController";
import { isAdmin } from "../middleware/auth";

const router = Router();

// User routes
router.get("/", listComplaints); // list by user
router.get("/:id", getComplaint); // get specific complaint
router.post("/", createComplaint); // create new complaint
router.patch("/:id", updateComplaint); // update title/desc/type
router.delete("/:id", deleteComplaint); // ✅ delete complaint

// Admin routes
router.get("/all", isAdmin, listAllComplaints); // admin: list all complaints
router.patch("/:id/status", isAdmin, updateStatus); // admin: update status

export default router;
