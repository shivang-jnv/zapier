/*
  Warnings:

  - Made the column `image` on table `AvailableAction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `AvailableTrigger` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AvailableAction" ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."AvailableTrigger" ALTER COLUMN "image" SET NOT NULL;
