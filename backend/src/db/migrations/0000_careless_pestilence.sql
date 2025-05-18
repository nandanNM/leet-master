CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'INTERNAL_ERROR');--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"tags" text[] NOT NULL,
	"user_id" uuid NOT NULL,
	"examples" jsonb NOT NULL,
	"constraints" text NOT NULL,
	"hints" text,
	"editorial" text,
	"testcases" jsonb NOT NULL,
	"code_snippets" jsonb NOT NULL,
	"reference_solutions" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "solved_problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"source_code" json NOT NULL,
	"language" varchar(100) NOT NULL,
	"stdin" text,
	"stdout" text,
	"stderr" text,
	"compile_output" text,
	"status" "submission_status",
	"memory" varchar(50),
	"time" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "test_case_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"test_case" integer NOT NULL,
	"passed" boolean NOT NULL,
	"stdout" text,
	"expected" text,
	"stderr" text,
	"compile_output" text,
	"status" varchar(50),
	"memory" varchar(50),
	"time" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"image" text,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_case_results" ADD CONSTRAINT "test_case_results_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_problem" ON "solved_problems" USING btree ("user_id","problem_id");--> statement-breakpoint
CREATE INDEX "test_case_results_submission_id_idx" ON "test_case_results" USING btree ("submission_id");