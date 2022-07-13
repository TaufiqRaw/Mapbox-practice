-- CreateTable
CREATE TABLE "marker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" VARCHAR(20) NOT NULL,
    "longitude" VARCHAR(20) NOT NULL,

    CONSTRAINT "marker_pkey" PRIMARY KEY ("id")
);
