import 'module-alias/register'
import app from './config/app'

app.listen(5000, () => {
  console.log('Server running at http:www.localhost.com:5000/')
})
