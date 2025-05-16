ALTER TABLE "problems" ALTER COLUMN "difficulty" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."difficulty";--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "difficulty" SET DATA TYPE "public"."difficulty" USING "difficulty"::"public"."difficulty";