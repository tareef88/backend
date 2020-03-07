import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import methodResponse from '../utils/routeResponse';
import db from '../utils/dbQueries';

const policeRoute = express.Router();

interface UpdateOfficerValues {
  [key: string]: any;
}

async function authorize(req: Request, res: Response, next: NextFunction) {
  const bearer: string | undefined = req.headers.authorization;
  const token = bearer && bearer.split(' ')[1];
  const checkOfficers = await db.get('officers', { token });
  if (checkOfficers.length) {
    return next();
  }
  return next(Error('not authorized'));
}


function missingAttributes(res: Response, attribute: string) {
  return methodResponse.sendError(res, `Missing attributes ${attribute}`, 404);
}


policeRoute.get('/cases', async (req: Request, res: Response) => {
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

policeRoute.post('/addOfficer', authorize, async (req: Request, res: Response) => {
  const { name } = req.body;
  console.log('name', name);
  if (!name) {
    return methodResponse.sendError(res, 'Missing Attributes name', 404);
  }
  try {
    const newOfficer = await db.insert('officers', { name, token: uuid() });
    return methodResponse.sendResponse(res, { data: { newOfficer } }, 200);
  } catch (error) {
    return methodResponse.sendError(res, error.message, 500);
  }
});

policeRoute.patch('/updateOfficer/:officerId', authorize, async (req: Request, res: Response) => {
  const { officerId } = req.params;
  const { name } = req.body;
  const { token } = req.body;
  const { engaged } = req.body;
  if (!officerId) {
    return missingAttributes(res, 'officerId');
  }
  if (!name && !token && !engaged) {
    return missingAttributes(res, 'name or token or engaged');
  }

  try {
    const updatingValues: UpdateOfficerValues = {};

    if (name) {
      updatingValues.name = name;
    }

    if (token) {
      updatingValues.token = token;
    }

    if (engaged) {
      updatingValues.engaged = engaged;
    }

    const updatedOfficer = await db.update('officers', Number(officerId), { name, token });
    return methodResponse.sendResponse(res, { data: updatedOfficer }, 200);
  } catch (error) {
    return methodResponse.sendError(res, error.message, 500);
  }
});

policeRoute.delete('/deleteOfficer/:officerId', authorize, async (req: Request, res: Response) => {
  const { officerId } = req.params;
  if (!officerId) {
    return missingAttributes(res, 'officerId');
  }

  try {
    await db.deleteObject('officers', Number(officerId));
    return methodResponse.sendResponse(res, { data: { message: `Successfully deleted officer wit id ${officerId}` } }, 200);
  } catch (error) {
    return methodResponse.sendError(res, `Error occurred while deleting office with id ${officerId}`, 200);
  }
});

policeRoute.patch('/solve/:caseId', authorize, async (req: Request, res: Response) => {
  const { caseId } = req.params;
  if (!caseId) {
    return missingAttributes(res, 'caseId');
  }
  try {
    // Mark case as solved
    const solvedCase = await db.update('cases', Number(caseId), { updated: new Date(), solved: true });
    const getCasesWithoutOfficers = await db.get('cases', { officer_id: null, solved: false });
    const officerId = solvedCase.officer_id;
    // Assign officer if there are cases without officers
    if (getCasesWithoutOfficers.length) {
      const freeCaseId = getCasesWithoutOfficers[0].id;
      // Assign officer to free case
      await db.update('cases', Number(freeCaseId), { updated: new Date(), officer_id: officerId });
    } else {
      // Mark officer as un-engaged
      await db.update('officers', Number(officerId), { engaged: false });
    }
    return methodResponse.sendResponse(res, { data: solvedCase }, 200);
  } catch (error) {
    return methodResponse.sendError(res, error.message, 500);
  }
});

export default policeRoute;
