import {Router} from "express";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistsDetails,
  getAllPlaylistsForUser,
  getPlaylistById,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controllers";
import {validate} from "../middlewares/validate.middleware";
import {PlaylistSchema} from "../schemas/playlist";
import {authMiddleware} from "../middlewares/auth.middleware";

const playlistRoutes = Router();

playlistRoutes.post(
  "/create",
  validate(PlaylistSchema),
  authMiddleware,
  createPlaylist,
);
playlistRoutes.get("/:problemId", authMiddleware, getAllPlaylistsDetails);
playlistRoutes.get("/", authMiddleware, getAllPlaylistsForUser);
playlistRoutes.get("/:id", authMiddleware, getPlaylistById);
playlistRoutes.post("/:id/add-problem", authMiddleware, addProblemToPlaylist);
playlistRoutes.delete("/:id", authMiddleware, deletePlaylist);
playlistRoutes.delete(
  "/:id/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist,
);

export default playlistRoutes;
