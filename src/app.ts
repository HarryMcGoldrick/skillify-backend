import * as express from 'express';
import * as cors from 'cors';
import { config } from 'dotenv';
import graphRoutes from './routes/graph-routes';
import userRoutes from './routes/user-routes';
import contentRoutes from './routes/content-routes';
import tagRoutes from './routes/tag-routes';
import achievementRoutes from './routes/achievement-routes';
import objectiveRoutes from './routes/objective-routes';

config();
const app = express();

app.use(cors());
app.use(express.json())
app.use('/graph', graphRoutes);
app.use('/user', userRoutes);
app.use('/content', contentRoutes);
app.use('/tag', tagRoutes)
app.use('/objective', objectiveRoutes)
app.use('/achievement', achievementRoutes)


module.exports = app;