-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IncidentPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EcoReportStatus" AS ENUM ('SUBMITTED', 'REVIEWED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "location" VARCHAR(255),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "reportedById" UUID,
    "type" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "priority" "IncidentPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED',
    "assignedToId" UUID,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_updates" (
    "id" UUID NOT NULL,
    "incidentId" UUID NOT NULL,
    "userId" UUID,
    "notes" TEXT NOT NULL,
    "previousStatus" "IncidentStatus",
    "newStatus" "IncidentStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_alerts" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "area" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "issuedById" UUID,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safety_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eco_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_activities" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),
    "organizer" VARCHAR(150),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eco_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_reports" (
    "id" UUID NOT NULL,
    "reportedById" UUID,
    "categoryId" UUID,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255),
    "priority" "IncidentPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "EcoReportStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignedToId" UUID,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eco_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_updates" (
    "id" UUID NOT NULL,
    "ecoReportId" UUID NOT NULL,
    "userId" UUID,
    "notes" TEXT NOT NULL,
    "previousStatus" "EcoReportStatus",
    "newStatus" "EcoReportStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eco_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incidents_reportedById_idx" ON "incidents"("reportedById");
CREATE INDEX "incidents_assignedToId_idx" ON "incidents"("assignedToId");
CREATE INDEX "incidents_status_idx" ON "incidents"("status");
CREATE INDEX "incidents_priority_idx" ON "incidents"("priority");

-- CreateIndex
CREATE INDEX "incident_updates_incidentId_idx" ON "incident_updates"("incidentId");
CREATE INDEX "incident_updates_userId_idx" ON "incident_updates"("userId");

-- CreateIndex
CREATE INDEX "safety_alerts_isActive_idx" ON "safety_alerts"("isActive");
CREATE INDEX "safety_alerts_severity_idx" ON "safety_alerts"("severity");
CREATE INDEX "safety_alerts_issuedById_idx" ON "safety_alerts"("issuedById");

-- CreateIndex
CREATE UNIQUE INDEX "eco_categories_name_key" ON "eco_categories"("name");
CREATE UNIQUE INDEX "eco_categories_slug_key" ON "eco_categories"("slug");

-- CreateIndex
CREATE INDEX "eco_reports_reportedById_idx" ON "eco_reports"("reportedById");
CREATE INDEX "eco_reports_assignedToId_idx" ON "eco_reports"("assignedToId");
CREATE INDEX "eco_reports_categoryId_idx" ON "eco_reports"("categoryId");
CREATE INDEX "eco_reports_status_idx" ON "eco_reports"("status");
CREATE INDEX "eco_reports_priority_idx" ON "eco_reports"("priority");

-- CreateIndex
CREATE INDEX "eco_updates_ecoReportId_idx" ON "eco_updates"("ecoReportId");
CREATE INDEX "eco_updates_userId_idx" ON "eco_updates"("userId");

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "incident_updates" ADD CONSTRAINT "incident_updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_alerts" ADD CONSTRAINT "safety_alerts_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_reports" ADD CONSTRAINT "eco_reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "eco_reports" ADD CONSTRAINT "eco_reports_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "eco_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "eco_reports" ADD CONSTRAINT "eco_reports_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_updates" ADD CONSTRAINT "eco_updates_ecoReportId_fkey" FOREIGN KEY ("ecoReportId") REFERENCES "eco_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eco_updates" ADD CONSTRAINT "eco_updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
