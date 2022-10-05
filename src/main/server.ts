import { MongoHelper } from '@/external/mongodb/helper'
import 'module-alias/register'

MongoHelper.connect(process.env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(5000, () => {
      console.log('Server running at http:www.localhost.com:5000/')
    })
  })
  .catch(console.error)
