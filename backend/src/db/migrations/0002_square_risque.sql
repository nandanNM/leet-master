CREATE TABLE "solved_problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"probleam_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_probleam_id_probleams_id_fk" FOREIGN KEY ("probleam_id") REFERENCES "public"."probleams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_probleam" ON "solved_problems" USING btree ("user_id","probleam_id");