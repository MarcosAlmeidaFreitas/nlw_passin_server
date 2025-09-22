/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
import type { FastifyInstance } from "fastify"
import { BadRequest } from "../routes/_errors/badRequest.ts"
import { HTTP_Status_Code } from "../status_code/index.ts"

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.log(error)
  if (error.validation) {
    return reply.status(HTTP_Status_Code.BAD_REQUEST).send({
      message: "Error during validation",
      context: error.validationContext,
      errors: error.validation,
    })
  }

  if (error instanceof BadRequest) {
    return reply
      .status(HTTP_Status_Code.BAD_REQUEST)
      .send({ message: error.message })
  }

  return reply
    .status(HTTP_Status_Code.INTERNAL_SERVER_ERROR)
    .send({ message: "Internal Server Error!" })
}
