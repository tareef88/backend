import express, {
  Request, Response, Application,
} from 'express';
import bodyParser from 'body-parser';
import { police, privateCitizen } from './routes';
// Create a new express application instance
const app: Application = express();
app.use(bodyParser.json());

app.use('/police', police);
app.use('/privateCitizen', privateCitizen);
app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ error: 'an error occurred' });
});

app.listen(3000, () => {
  console.log('Catalog of stolen bikes backend up and running!!!!!!!______ ');
});
