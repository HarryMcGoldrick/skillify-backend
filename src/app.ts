import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import graphRoutes from './routes/graph';

const app = express();


//#region database configuration

const url = 'mongodb://127.0.0.1:27017/project'
mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

//#endregion

//#region api configuration
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/graph', graphRoutes);

app.listen(3000, () => {
    console.log('listening on 3000!')
  })

//#endregion
