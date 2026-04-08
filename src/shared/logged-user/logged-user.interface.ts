import { UserEntity } from "@/core/user/entities/user.entity";

export interface LoggedUserService {
  getLoggedUser(): UserEntity;
  setLoggedUser(loggedUser: UserEntity): void;
}