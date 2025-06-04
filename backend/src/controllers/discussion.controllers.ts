import {isAuthenticated} from "../utils/auth";
import {Discussion} from "../schemas/discussion";
import {asyncHandler} from "../utils/async-handler";
import {ApiError, ApiResponse} from "../utils/responses";
import {db} from "../db";
import {discussionTable} from "../db/schema";
import {eq} from "drizzle-orm";

export const createDiscussion = asyncHandler(async (req, res) => {
  const {message} = req.body as Discussion;
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {problemId} = req.params;
  const {id: userId} = req.user;
  const [inserted] = await db
    .insert(discussionTable)
    .values({
      message,
      userId,
      problemId,
    })
    .returning({id: discussionTable.id});
  const [discussion] = await db.query.discussionTable.findMany({
    where: eq(discussionTable.id, inserted.id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    columns: {
      id: true,
      message: true,
      createdAt: true,
    },
  });
  console.log("discussion", discussion);
  new ApiResponse(201, "Discussion created successfully", discussion).send(res);
});

export const getAllDiscussionsForProblem = asyncHandler(async (req, res) => {
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {problemId} = req.params;
  const discussions = await db.query.discussionTable.findMany({
    where: eq(discussionTable.problemId, problemId),
    orderBy: (submissionsTable, {desc}) => [desc(submissionsTable.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  new ApiResponse(200, "Discussions fetched successfully", discussions).send(
    res,
  );
});
