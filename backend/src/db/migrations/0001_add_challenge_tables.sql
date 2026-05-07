CREATE TYPE "public"."challengeMode" AS ENUM('1v1', 'group');--> statement-breakpoint
CREATE TYPE "public"."challengeStatus" AS ENUM('waiting', 'active', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."participantStatus" AS ENUM('joined', 'submitted');--> statement-breakpoint
CREATE TABLE "challenge" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"code" varchar(12) NOT NULL,
	"problemId" uuid NOT NULL,
	"creatorId" uuid NOT NULL,
	"mode" "challengeMode" DEFAULT '1v1' NOT NULL,
	"maxParticipants" integer DEFAULT 2 NOT NULL,
	"status" "challengeStatus" DEFAULT 'waiting' NOT NULL,
	"startedAt" timestamp,
	"endsAt" timestamp,
	"durationSeconds" integer DEFAULT 3600 NOT NULL,
	CONSTRAINT "challenge_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "challengeParticipant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"challengeId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"status" "participantStatus" DEFAULT 'joined' NOT NULL,
	"submissionId" uuid,
	"rank" integer,
	"finishedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challengeParticipant" ADD CONSTRAINT "challengeParticipant_challengeId_challenge_id_fk" FOREIGN KEY ("challengeId") REFERENCES "public"."challenge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challengeParticipant" ADD CONSTRAINT "challengeParticipant_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challengeParticipant" ADD CONSTRAINT "challengeParticipant_submissionId_submission_id_fk" FOREIGN KEY ("submissionId") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "challengeStatusIdx" ON "challenge" USING btree ("status");--> statement-breakpoint
CREATE INDEX "challengeCodeIdx" ON "challenge" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "challengeParticipantUniqueIdx" ON "challengeParticipant" USING btree ("challengeId","userId");--> statement-breakpoint
CREATE INDEX "challengeParticipantChallengeIdx" ON "challengeParticipant" USING btree ("challengeId");