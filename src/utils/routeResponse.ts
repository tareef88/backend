import { Response } from 'express';

function sendResponse(res: Response, data: any, status: number) {
  return res.status(status).send(data);
}

function sendError(res: Response, message: string, status: number) {
  return res.status(status).json({
    errors: { message },
  });
}

export default {
  sendResponse,
  sendError,
};
