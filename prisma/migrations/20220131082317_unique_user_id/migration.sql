/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Playback` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playback_userId_key" ON "Playback"("userId");
