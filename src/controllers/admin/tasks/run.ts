import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { ConfigTypes, TechTypes } from "../../../types";
import { TaskTypes } from "../../../types/task-types";

export const runTaskRequestValidation = Joi.object().keys({
  id: Joi.string().required(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, TaskTypes.Requests.RunTaskRequest>,
  res
) => {
  try {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Running Task.",
    };

    res.send(response);
    const SP = ServicesProvider.get();
    const task = await SP.Task();

    const { id } = req.body;

    await task.runTask(id);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to run task",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: runTaskRequestValidation },
});
