import {isAuthenticated} from "../utils/auth.utils";
import {Discussion} from "../validations/discussion";
import {asyncHandler} from "../utils/async-handler.utils";
import {ApiError, ApiResponse} from "../utils/responses.utils";
import {db} from "../db";
import {discussionTable} from "../db/schema";
import {eq} from "drizzle-orm";

export const createDiscussion = asyncHandler(
  async (req: Request, res: Response) => {
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
        problemId: problemId as string,
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
    new ApiResponse(201, "Discussion created successfully", discussion).send(
      res,
    );
  },
);

export const getAllDiscussionsForProblem = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {problemId} = req.params;
    const discussions = await db.query.discussionTable.findMany({
      where: eq(discussionTable.problemId, problemId as string),
      orderBy: (discussionTable, {desc}) => [desc(discussionTable.createdAt)],
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
  },
);
