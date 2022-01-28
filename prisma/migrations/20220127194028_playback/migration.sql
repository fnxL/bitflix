-- CreateTable
CREATE TABLE "Playback" (
    "id" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "backdrop_path" TEXT,
    "poster_path" TEXT,
    "playbackId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Playback_id_key" ON "Playback"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_playbackId_key" ON "Movie"("playbackId");

-- AddForeignKey
ALTER TABLE "Playback" ADD CONSTRAINT "Playback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_playbackId_fkey" FOREIGN KEY ("playbackId") REFERENCES "Playback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
