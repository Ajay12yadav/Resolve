import { Router } from "express";
import { listComplaints, getComplaint, createComplaint, updateComplaintStatus } from "../controllers/complaintsController";

const router = Router();

router.get("/", listComplaints); // optional query ?userId=...
router.get("/:id", getComplaint);
router.post("/", createComplaint);
router.patch("/:id/status", updateComplaintStatus);

export default router;