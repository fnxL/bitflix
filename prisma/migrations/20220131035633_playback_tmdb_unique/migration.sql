/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Playback` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playback_tmdbId_key" ON "Playback"("tmdbId");
