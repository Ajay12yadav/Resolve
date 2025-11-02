import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ComplaintStatus } from "../types/complaint";

const prisma = new PrismaClient();

// 🧾 List all complaints (optionally filter by userId)
export const listComplaints = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    const complaints = await prisma.complaint.findMany({
      where: userId
        ? {
            userId: parseInt(userId),
          }
        : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
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
        userId: parseInt(userId),
        title,
        description,
        type,
        status: "pending" as ComplaintStatus,
      },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    console.log("Created complaint:", complaint);
    res.status(201).json(complaint);
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({
      error: "Failed to create complaint",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// 🔄 Update complaint status (Admin only)
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    res.json(complaint);
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Failed to update complaint status" });
  }
};

// ✏️ Update complaint details
export const updateComplaint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, type } = req.body;

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { title, description, type },
    });

    res.json(complaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Failed to update complaint" });
  }
};

// ❌ Delete a complaint
export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Check if the complaint exists
    const existing = await prisma.complaint.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    await prisma.complaint.delete({ where: { id } });
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Failed to delete complaint" });
  }
};

// 🧾 List all complaints (for admin)
export const listAllComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};
