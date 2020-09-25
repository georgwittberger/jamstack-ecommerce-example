import 'dotenv/config'
import log from './logger'
import { getAccessToken } from './salesforce-api'
import { updateCategoriesContent } from './categories'
import { updateProductsContent } from './products'

async function execute() {
  const accessToken = await getAccessToken()
  await updateCategoriesContent(accessToken)
  await updateProductsContent(accessToken)
}

execute()
  .then(() => {
    log.info('Content update successful')
    process.exitCode = 0
  })
  .catch((error) => {
    log.error('Content update failed. %o', error)
    process.exitCode = 1
  })
