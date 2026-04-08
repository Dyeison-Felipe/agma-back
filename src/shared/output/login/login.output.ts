import { UserOutput } from "../user/create-user.output";

export type LoginOutput = {
  user: UserOutput;
  token?: string;
};
