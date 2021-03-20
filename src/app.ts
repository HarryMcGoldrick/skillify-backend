import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { config } from 'dotenv';
import graphRoutes from './routes/graph-routes';
import userRoutes from './routes/user-routes';
import contentRoutes from './routes/content-routes';
import tagRoutes from './routes/tag-routes';
import objectiveRoutes from './routes/objective-routes';
import { addManyContentTags } from './controllers/tag-controller';
import tags from './tags/tags';

config();
const app = express();

//#region database configuration

const url = 'mongodb://127.0.0.1:27017/project'
mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  // tslint:disable-next-line: no-console
  console.log('Database connected:', url)
})

db.on('error', err => {
  // tslint:disable-next-line: no-console
  console.error('connection error:', err)
})

//#endregion

//#region api configuration


app.use(cors());
app.use(express.json())
app.use('/graph', graphRoutes);
app.use('/user', userRoutes);
app.use('/content', contentRoutes);
app.use('/tag', tagRoutes)
app.use('/objective', objectiveRoutes)

// If tags collection is empty add them from tags.ts
db.collections.tags.countDocuments((err, count) => {
  if (count === 0) {
    addManyContentTags(tags);
  }
})

app.listen(3000, () => {
    console.log('listening on 3000!')
  })

//#endregion
