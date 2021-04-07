const mongoDB = require('./db');
const app = require('./app');
import { addManyContentTags } from './controllers/tag-controller';
import tags from './enums/tags';
import { addManyAchievements } from './controllers/achievement-controller';
import { achievementObjects } from './enums/achievements';

const db = mongoDB.connect()

db.once('open', () => {
  // tslint:disable-next-line: no-console
  console.log('Database connected')
})

db.on('error', err => {
  // tslint:disable-next-line: no-console
  console.error('connection error:', err)
})

// If tags collection does not match tags enum then add them
db.collections.tags.countDocuments((err, count) => {
  if (count < tags.length) {
    addManyContentTags(tags);
  }
})

db.collections.achievements.countDocuments((err, count) => {
  if (count < achievementObjects.length) {
    addManyAchievements(achievementObjects);
  }
})

app.listen(3000, () => {
    console.log('listening on 3000!')
  })