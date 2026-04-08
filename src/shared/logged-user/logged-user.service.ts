import { Injectable, Scope } from "@nestjs/common";
import { LoggedUserService } from "./logged-user.interface";
import { UserEntity } from "@/core/user/entities/user.entity";

@Injectable({ scope: Scope.REQUEST })
export class LoggedUserServiceImpl implements LoggedUserService {
  private loggedUser: UserEntity;

  getLoggedUser(): UserEntity {
    return this.loggedUser;
  }

  setLoggedUser(loggedUser: UserEntity) {
    this.loggedUser = loggedUser;
  }
  
}