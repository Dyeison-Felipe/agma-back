import { UseInterceptors } from "@nestjs/common";
import { ParseMultipartInterceptor } from "../interceptors/parse-multipart.interceptor";

export function Multipart() {
  return UseInterceptors(ParseMultipartInterceptor);
}