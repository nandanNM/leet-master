import {Request, Response} from "express";
import {asyncHandler} from "../utils/async-handler";
import {Playlist} from "../schemas/playlist";
import {isAuthenticated} from "../utils/auth";
import {ApiError, ApiResponse} from "../utils/responses";
import {db} from "src/db";
import {playlistsTable, problemsInPlaylistTable} from "src/db/schema";
import {and, eq, inArray} from "drizzle-orm";

export const createPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const {name, description} = req.body as Playlist;
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const [playlist] = await db
      .insert(playlistsTable)
      .values({
        name,
        description: description || null,
        userId,
      })
      .returning();
    new ApiResponse(201, "Playlist created successfully", playlist).send(res);
  },
);

export const getAllPlaylistsDetails = asyncHandler(async (req, res) => {
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {problemId: problemIdToExclude} = req.params;
  const {id: userId} = req.user;
  // console.log(playlistIdToExclude, userId, "playlistIdToExclude");
  const playLists = await db.query.playlistsTable.findMany({
    where: (playlistsTable, {eq, and, not, exists}) =>
      and(
        eq(playlistsTable.userId, userId),
        not(
          exists(
            db
              .select()
              .from(problemsInPlaylistTable)
              .where(
                and(
                  eq(problemsInPlaylistTable.playListId, playlistsTable.id),
                  eq(problemsInPlaylistTable.problemId, problemIdToExclude),
                ),
              ),
          ),
        ),
      ),
  });
  // console.log("playLists", playLists);
  new ApiResponse(200, "Playlists fetched successfully", playLists).send(res);
});
export const getAllPlaylistsForUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
    }
    const {id: userId} = req.user;
    const playLists = await db.query.playlistsTable.findMany({
      where: (playlistsTable, {eq}) => eq(playlistsTable.userId, userId),
    });
    new ApiResponse(201, "Playlist created successfully", playLists).send(res);
  },
);

export const getPlaylistById = asyncHandler(async (req, res) => {
  const {id: playlistId} = req.params;
  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
  }
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {id: userId} = req.user;
  const playlist = await db.query.playlistsTable.findFirst({
    where: (playlistsTable, {eq}) =>
      and(eq(playlistsTable.id, playlistId), eq(playlistsTable.userId, userId)),
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
});

export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const {id: playListId} = req.params;
  const {problemIds} = req.body;
  if (!playListId) {
    throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
  }
  if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Problem IDs are required", "BAD_REQUEST");
  }
  const problemsInPlaylist = await db
    .insert(problemsInPlaylistTable)
    .values(problemIds.map((problemId) => ({playListId, problemId})));

  new ApiResponse(201, "Problem added to playlist successfully").send(res);
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const {id: playlistId} = req.params;
  if (!playlistId) {
    throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
  }
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {id: userId} = req.user;
  const deletedPlaylist = await db
    .delete(playlistsTable)
    .where(
      and(eq(playlistsTable.id, playlistId), eq(playlistsTable.userId, userId)),
    )
    .returning();
  if (!deletedPlaylist) {
    throw new ApiError(404, "Playlist not found", "NOT_FOUND");
  }
  new ApiResponse(200, "Playlist deleted successfully").send(res);
});
export const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
  const {id: playListId} = req.params;
  const {problemIds} = req.body;
  if (!playListId) {
    throw new ApiError(400, "Playlist ID is required", "BAD_REQUEST");
  }
  if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Problem ID is required", "BAD_REQUEST");
  }
  const deletedProblem = await db
    .delete(problemsInPlaylistTable)
    .where(
      and(
        eq(problemsInPlaylistTable.playListId, playListId),
        inArray(problemsInPlaylistTable.problemId, problemIds),
      ),
    )
    .returning();
  if (!deletedProblem) {
    throw new ApiError(404, "Problem not found in playlist", "NOT_FOUND");
  }
  new ApiResponse(200, "Problem removed from playlist successfully").send(res);
});
