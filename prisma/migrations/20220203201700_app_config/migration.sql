-- CreateTable
CREATE TABLE "AppConfig" (
    "latestVersion" TEXT NOT NULL,
    "latestVersionCode" INTEGER,
    "url" TEXT NOT NULL,
    "releaseNotes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_latestVersion_key" ON "AppConfig"("latestVersion");
