import { Router } from "express";
import { listComplaints, listAllComplaints, updateStatus, createComplaint } from "../controllers/complaintsController";
import { isAdmin } from "../middleware/auth";

const router = Router();

router.get("/all", isAdmin, listAllComplaints);
router.get("/", listComplaints);
router.patch('/:id/status', isAdmin, updateStatus);
router.post('/', createComplaint);

export default router;