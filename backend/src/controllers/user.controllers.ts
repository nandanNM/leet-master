import {Request, Response} from "express";

import {UpdateUser} from "../validations/user";
import {ApiResponse, ApiError} from "../utils/responses.utils";
import {db} from "../db";
import {userTable} from "../db/schema";
import {asyncHandler} from "../utils/async-handler.utils";
import {isAuthenticated} from "../utils/auth.utils";
import {uploadOnCloudinary} from "../utils/cloudinary.utils";

import {eq} from "drizzle-orm";
import {slugifyName} from "../utils";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (!isAuthenticated(req)) {
    throw new ApiError(401, "Authentication required", "UNAUTHORIZED");
  }
  const {id: userId} = req.user;
  const {name, bio} = req.body as UpdateUser;
  const user = await db.query.userTable.findFirst({
    where: (userTable, {eq}) => eq(userTable.id, userId),
  });
  if (!user) {
    throw new ApiError(404, "User not found", "NOT_FOUND");
  }
  let avatarFilePath;
  let avatarUrl;
  let avatarPublicId;
  if (
    req.files &&
    !Array.isArray(req.files) &&
    req.files.avatar &&
    req.files.avatar.length > 0
  ) {
    avatarFilePath = req.files.avatar[0].path;
  }
  if (avatarFilePath) {
    const avatar = await uploadOnCloudinary(
      avatarFilePath,
      slugifyName(user.name) + Date.now(),
    );
    if (user.image) {
      // await deleteOnCloudinary(user.avatarPublicId);
    }
    if (avatar) {
      avatarPublicId = avatar.public_id;
      avatarUrl = avatar.secure_url;
    }
  }

  const [updatedUser] = await db
    .update(userTable)
    .set({
      name,
      bio,
      image: avatarUrl,
    })
    .where(eq(userTable.id, userId))
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      bio: userTable.bio,
      image: userTable.image,
      role: userTable.role,
    });
  new ApiResponse(200, "User updated successfully", updatedUser).send(res);
});
