-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('open', 'in_progress', 'resolved');

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
