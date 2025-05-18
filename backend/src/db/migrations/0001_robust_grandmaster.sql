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
	"status" varchar(50),
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
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_probleams_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."probleams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_case_results" ADD CONSTRAINT "test_case_results_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "test_case_results_submission_id_idx" ON "test_case_results" USING btree ("submission_id");