import {Router} from "express";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistsDetails,
  getAllPlaylistsForUser,
  getPlaylistById,
  removeProblemFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers";
import {validate} from "../middlewares/validate.middleware";
import {PlaylistSchema} from "../validations/playlist";
import {requireAnyAuth} from "../middlewares/role.middleware";

const playlistRoutes = Router();

playlistRoutes.post(
  "/create",
  validate(PlaylistSchema),
  requireAnyAuth,
  createPlaylist,
);
playlistRoutes.get("/:problemId", requireAnyAuth, getAllPlaylistsDetails);
playlistRoutes.get("/", requireAnyAuth, getAllPlaylistsForUser);
playlistRoutes.get("/details/:id", requireAnyAuth, getPlaylistById);
playlistRoutes.post("/:id/add-problem", requireAnyAuth, addProblemToPlaylist);
playlistRoutes.delete("/:id", requireAnyAuth, deletePlaylist);
playlistRoutes.post(
  "/:id/remove-problems",
  requireAnyAuth,
  removeProblemFromPlaylist,
);
playlistRoutes.post(
  "/update/:id",
  validate(PlaylistSchema),
  requireAnyAuth,
  updatePlaylist,
);

export default playlistRoutes;
