CREATE TYPE "public"."difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."submissionStatus" AS ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'INTERNAL_ERROR');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"accountId" uuid NOT NULL,
	"providerId" text NOT NULL,
	"userId" uuid NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" uuid NOT NULL,
	"impersonatedBy" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"bio" text,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean DEFAULT false,
	"banReason" text,
	"banExpires" timestamp,
	"isActive" boolean,
	"disabledAt" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"problemId" uuid NOT NULL,
	"parentId" uuid,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"videoUrl" varchar(1000),
	"userId" uuid NOT NULL,
	"examples" jsonb NOT NULL,
	"constraints" text,
	"hints" text,
	"editorialCode" jsonb,
	"codeSnippets" jsonb,
	"referenceSolutions" jsonb,
	"driverCode" jsonb,
	"timeLimit" integer DEFAULT 2000,
	"memoryLimit" integer DEFAULT 256,
	CONSTRAINT "problem_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "problemCompany" (
	"problemId" uuid NOT NULL,
	"companyId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problemSubject" (
	"problemId" uuid NOT NULL,
	"subjectId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problemTestCase" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"problemId" uuid NOT NULL,
	"input" text NOT NULL,
	"expectedOutput" text NOT NULL,
	"isSample" boolean DEFAULT false,
	"order" integer
);
--> statement-breakpoint
CREATE TABLE "solvedProblem" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"problemId" uuid NOT NULL,
	"submissionId" uuid NOT NULL,
	"solutionCode" text NOT NULL,
	"language" varchar(50) NOT NULL,
	"runtime" integer,
	"memory" integer,
	"solvedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	CONSTRAINT "subject_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"problemId" uuid NOT NULL,
	"sourceCode" text NOT NULL,
	"language" varchar(50) NOT NULL,
	"status" "submissionStatus",
	"runtime" integer,
	"memory" integer,
	"stdout" text,
	"stderr" text,
	"compileOutput" text
);
--> statement-breakpoint
CREATE TABLE "testCaseResult" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"submissionId" uuid NOT NULL,
	"testCaseId" uuid,
	"passed" boolean NOT NULL,
	"stdout" text,
	"expected" text,
	"stderr" text,
	"status" varchar(50),
	"memory" integer,
	"time" integer
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_parentId_discussion_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."discussion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problemCompany" ADD CONSTRAINT "problemCompany_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problemCompany" ADD CONSTRAINT "problemCompany_companyId_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problemSubject" ADD CONSTRAINT "problemSubject_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problemSubject" ADD CONSTRAINT "problemSubject_subjectId_subject_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problemTestCase" ADD CONSTRAINT "problemTestCase_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solvedProblem" ADD CONSTRAINT "solvedProblem_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solvedProblem" ADD CONSTRAINT "solvedProblem_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solvedProblem" ADD CONSTRAINT "solvedProblem_submissionId_submission_id_fk" FOREIGN KEY ("submissionId") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_problemId_problem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testCaseResult" ADD CONSTRAINT "testCaseResult_submissionId_submission_id_fk" FOREIGN KEY ("submissionId") REFERENCES "public"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testCaseResult" ADD CONSTRAINT "testCaseResult_testCaseId_problemTestCase_id_fk" FOREIGN KEY ("testCaseId") REFERENCES "public"."problemTestCase"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accountUserIdIdx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessionUserIdIdx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verificationIdentifierIdx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "discussionParentIdx" ON "discussion" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "discussionProblemIdx" ON "discussion" USING btree ("problemId");--> statement-breakpoint
CREATE INDEX "problemDifficultyIdx" ON "problem" USING btree ("difficulty");--> statement-breakpoint
CREATE UNIQUE INDEX "problemCompanyUniqueIdx" ON "problemCompany" USING btree ("problemId","companyId");--> statement-breakpoint
CREATE INDEX "problemSubjectIdx" ON "problemSubject" USING btree ("problemId","subjectId");--> statement-breakpoint
CREATE INDEX "testCaseProblemIdx" ON "problemTestCase" USING btree ("problemId");--> statement-breakpoint
CREATE UNIQUE INDEX "userProblemUniqueIdx" ON "solvedProblem" USING btree ("userId","problemId");--> statement-breakpoint
CREATE INDEX "userSolvedIdx" ON "solvedProblem" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "submissionUserProblemIdx" ON "submission" USING btree ("userId","problemId");--> statement-breakpoint
CREATE INDEX "submissionStatusIdx" ON "submission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "testCaseSubmissionIdx" ON "testCaseResult" USING btree ("submissionId");