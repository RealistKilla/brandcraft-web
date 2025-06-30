-- CreateTable
CREATE TABLE "age_ranges" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ageRange" TEXT NOT NULL,

    CONSTRAINT "age_ranges_pkey" PRIMARY KEY ("id")
);
