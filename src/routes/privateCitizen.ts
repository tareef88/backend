import express, { Request, Response, NextFunction } from 'express';
import methodResponse from '../utils/routeResponse';
import db from '../utils/dbQueries';

const privateCitizen = express.Router();


privateCitizen.get('/cases', async (req: Request, res: Response) => {
  try {
    const cases = await db.get('cases', {});
    const data = {
      data: {
        cases,
      },
    };
    return methodResponse.sendResponse(res, data, 200);
  } catch (error) {
    return methodResponse.sendError(res, 'Error while fetching data', 404);
  }
});

privateCitizen.post('/report', async (req: Request, res: Response) => {
  try {
    const insertedCase = await db.insert('cases', { ...req.body });
    const getFreeOfficers = await db.get('officers', { engaged: false });
    if (!getFreeOfficers.length) {
      return methodResponse.sendResponse(res, { data: { case: insertedCase } }, 200);
    }
    const officer_id = getFreeOfficers[0].id;
    // Assign officer to case
    await db.update('cases', insertedCase.id, { officer_id, updated: new Date() });
    return methodResponse.sendResponse(res, { data: { case: insertedCase } }, 200);
  } catch (error) {
    return methodResponse.sendError(res, error.message, 500);
  }
});

export default privateCitizen;
