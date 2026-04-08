import { Global, Module } from "@nestjs/common";
import { LoggedUserServiceImpl } from "./logged-user.service";
import { PROVIDERS } from "../constants/providers";

@Global()
@Module({
  imports: [],
  providers: [{
    provide: PROVIDERS.LOGGED_USER_SERVICE,
    useClass: LoggedUserServiceImpl
  }],
  exports: [PROVIDERS.LOGGED_USER_SERVICE],
})
export class LoggedUserModule {}