ALTER TABLE "submission" DROP COLUMN "runtime";--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "stdin" text;--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "time" text;--> statement-breakpoint
ALTER TABLE "submission" ALTER COLUMN "memory" TYPE text USING memory::text;--> statement-breakpoint
ALTER TABLE "testCaseResult" ALTER COLUMN "memory" TYPE varchar(30) USING memory::varchar;--> statement-breakpoint
ALTER TABLE "testCaseResult" ALTER COLUMN "time" TYPE varchar(30) USING time::varchar;--> statement-breakpoint
ALTER TABLE "testCaseResult" ADD COLUMN "compileOutput" text;