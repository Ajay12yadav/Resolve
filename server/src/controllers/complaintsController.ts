import { Request, Response } from "express";
import { prisma } from "../db";

// 🧾 List all complaints (optionally filter by userId)
export const listComplaints = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    const complaints = await prisma.complaint.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error listing complaints:", error);
    res.status(500).json({ error: "Failed to list complaints" });
  }
};

// 🔍 Get a single complaint by ID
export const getComplaint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const complaint = await prisma.complaint.findUnique({ where: { id } });

    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    res.json(complaint);
  } catch (error) {
    console.error("Error getting complaint:", error);
    res.status(500).json({ error: "Failed to fetch complaint" });
  }
};

// 🆕 Create a new complaint
export const createComplaint = async (req: Request, res: Response) => {
  try {
    console.log("Received complaint:", req.body);
    const { userId, title, description, type } = req.body;

    if (!userId || !title || !description || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: String(userId), // ✅ ensure it’s always a string
        title,
        description,
        type,
        status: "open",
      },
    });

    console.log("Created complaint:", complaint);
    res.status(201).json(complaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: "Failed to create complaint" });
  }
};

// 🔄 Update complaint status
export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    res.json(complaint);
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Failed to update complaint status" });
  }
};
