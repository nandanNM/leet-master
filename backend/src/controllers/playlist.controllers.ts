import {Request, Response} from "express";
import {asyncHandler} from "../utils/async-handler.utils";
import {Playlist} from "../validations/playlist";
import {isAuthenticated} from "../utils/auth.utils";
import {ApiError, ApiResponse} from "../utils/responses.utils";
import {db} from "../db";
import {playlistTable, problemInPlaylistTable} from "../db/schema";
import {and, eq, inArray} from "drizzle-orm";
import {date} from "drizzle-orm/mysql-core";

export const createPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const {name, description} = req.body as Playlist;
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const [playlist] = await db
      .insert(playlistTable)
      .values({
        name,
        description: description || null,
        userId,
      })
      .returning();
    new ApiResponse(201, "Playlist created successfully", playlist).send(res);
  },
);

export const getAllPlaylistsDetails = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {problemId: problemIdToExclude} = req.params;
    const {id: userId} = req.user;
    const playLists = await db.query.playlistTable.findMany({
      where: (playlistTable, {eq, and, not, exists}) =>
        and(
          eq(playlistTable.userId, userId),
          not(
            exists(
              db
                .select()
                .from(problemInPlaylistTable)
                .where(
                  and(
                    eq(problemInPlaylistTable.playListId, playlistTable.id),
                    eq(
                      problemInPlaylistTable.problemId,
                      problemIdToExclude as string,
                    ),
                  ),
                ),
            ),
          ),
        ),
    });
    new ApiResponse(200, "Playlists fetched successfully", playLists).send(res);
  },
);
export const getAllPlaylistsForUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const playLists = await db.query.playlistTable.findMany({
      where: (playlistTable, {eq}) => eq(playlistTable.userId, userId),
    });
    new ApiResponse(201, "Playlist created successfully", playLists).send(res);
  },
);

export const getPlaylistById = asyncHandler(
  async (req: Request, res: Response) => {
    const {id: playlistId} = req.params;
    if (!playlistId) {
      throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
    }
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const playlist = await db.query.playlistTable.findFirst({
      where: (playlistTable, {eq}) =>
        and(
          eq(playlistTable.id, playlistId as string),
          eq(playlistTable.userId, userId),
        ),
      with: {
        problems: {
          with: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      throw new ApiError(404, "Playlist not found", "NOT_FOUND");
    }
    new ApiResponse(200, "Playlist fetched successfully", playlist).send(res);
  },
);

export const addProblemToPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const {id: playListId} = req.params;
    const {problemIds} = req.body;
    if (!playListId) {
      throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
    }
    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "Problem IDs are required", "BAD_REQUEST");
    }
    const problemsInPlaylist = await db.insert(problemInPlaylistTable).values(
      problemIds.map((problemId: string) => ({
        playListId: playListId as string,
        problemId,
      })),
    );

    new ApiResponse(201, "Problem added to playlist successfully").send(res);
  },
);

export const deletePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const {id: playlistId} = req.params;
    if (!playlistId) {
      throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
    }
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const deletedPlaylist = await db
      .delete(playlistTable)
      .where(
        and(
          eq(playlistTable.id, playlistId as string),
          eq(playlistTable.userId, userId),
        ),
      )
      .returning();
    if (!deletedPlaylist) {
      throw new ApiError(404, "Playlist not found", "NOT_FOUND");
    }
    new ApiResponse(200, "Playlist deleted successfully").send(res);
  },
);
export const removeProblemFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const {id: playListId} = req.params;
    const {problemIds} = req.body;
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    if (!playListId) {
      throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
    }
    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "Problem ID is required", "BAD_REQUEST");
    }
    const deletedProblem = await db
      .delete(problemInPlaylistTable)
      .where(
        and(
          eq(problemInPlaylistTable.playListId, playListId as string),
          inArray(problemInPlaylistTable.problemId, problemIds),
        ),
      );

    if (!deletedProblem) {
      throw new ApiError(404, "Problem not found in playlist", "NOT_FOUND");
    }
    new ApiResponse(200, "Problem removed from playlist successfully").send(
      res,
    );
  },
);

export const updatePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const {id: playListId} = req.params;

    const {name, description} = req.body as Playlist;
    const [updatedPlaylist] = await db
      .update(playlistTable)
      .set({
        name,
        description,
      })
      .where(
        and(
          eq(playlistTable.id, playListId as string),
          eq(playlistTable.userId, userId),
        ),
      )
      .returning();

    if (!updatedPlaylist) {
      throw new ApiError(404, "Playlist not found", "NOT_FOUND");
    }
    new ApiResponse(200, "Playlist updated successfully", updatedPlaylist).send(
      res,
    );
  },
);
