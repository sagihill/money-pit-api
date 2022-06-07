import { ID } from "../../lib/common";
import { UserTypes } from "../../types";

export function createNewUserDetails(request: UserTypes.AddUserRequest) {
  const now = new Date();
  const userDetails: UserTypes.UserDetails = {
    ...request,
    role: UserTypes.UserRole.Regular,
    id: ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return userDetails;
}
