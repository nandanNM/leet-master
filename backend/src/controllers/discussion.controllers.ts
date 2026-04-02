import {Request, Response} from "express";
import {isAuthenticated} from "../utils/auth.utils";
import {Discussion} from "../validations/discussion";
import {asyncHandler} from "../utils/async-handler.utils";
import {ApiError, ApiResponse} from "../utils/responses.utils";
import {db} from "../db";
import {discussion as discussionTable} from "../db/schema";
import {eq, desc} from "drizzle-orm";
import {requiredId} from "src/validations";
import {validateData} from "src/middlewares/validate.middleware";

export const createDiscussion = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req))
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");

    const {message, parentId} = req.body as Discussion;
    const {id: problemId} = validateData(requiredId, req.params);

    const {id: userId} = req.user;

    if (parentId) {
      const [parent] = await db
        .select({
          id: discussionTable.id,
          problemId: discussionTable.problemId,
          parentId: discussionTable.parentId,
        })
        .from(discussionTable)
        .where(eq(discussionTable.id, parentId));

      if (!parent)
        throw new ApiError(404, "Parent discussion not found", "NOT_FOUND");
      if (parent.problemId !== problemId)
        throw new ApiError(
          400,
          "Parent belongs to a different problem",
          "BAD_REQUEST",
        );
      if (parent.parentId)
        throw new ApiError(
          400,
          "Cannot nest replies more than one level",
          "BAD_REQUEST",
        );
    }

    const [inserted] = await db
      .insert(discussionTable)
      .values({message, userId, problemId, parentId: parentId ?? null})
      .returning({
        id: discussionTable.id,
        message: discussionTable.message,
        parentId: discussionTable.parentId,
        createdAt: discussionTable.createdAt,
      });

    new ApiResponse(201, "Discussion created successfully", inserted).send(res);
  },
);

export const getAllDiscussionsForProblem = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req))
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");

    const {id: problemId} = validateData(requiredId, req.params);

    const allDiscussions = await db
      .select({
        id: discussionTable.id,
        message: discussionTable.message,
        parentId: discussionTable.parentId,
        createdAt: discussionTable.createdAt,
        userId: discussionTable.userId,
      })
      .from(discussionTable)
      .where(eq(discussionTable.problemId, problemId))
      .orderBy(desc(discussionTable.createdAt));

    const topLevel = allDiscussions
      .filter((d) => d.parentId === null)
      .map((d) => ({
        ...d,
        replies: allDiscussions.filter((r) => r.parentId === d.id),
      }));

    new ApiResponse(200, "Discussions fetched successfully", topLevel).send(
      res,
    );
  },
);

export const deleteDiscussion = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req))
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");

    const {id: discussionId} = validateData(requiredId, req.params);
    const {id: userId} = req.user;

    const [existing] = await db
      .select({id: discussionTable.id, userId: discussionTable.userId})
      .from(discussionTable)
      .where(eq(discussionTable.id, discussionId));

    if (!existing) throw new ApiError(404, "Discussion not found", "NOT_FOUND");
    if (existing.userId !== userId)
      throw new ApiError(403, "Forbidden", "FORBIDDEN");

    await db
      .delete(discussionTable)
      .where(eq(discussionTable.id, discussionId));

    new ApiResponse(200, "Discussion deleted successfully", null).send(res);
  },
);
