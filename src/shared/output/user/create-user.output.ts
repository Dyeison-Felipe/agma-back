import { RoleOutput } from "../role/role-output";

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: RoleOutput
}