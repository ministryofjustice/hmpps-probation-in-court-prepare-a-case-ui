import { Router } from 'express'

import type { Services } from '../services'
import CourtController from '../controllers/courtController'
import CaseController from '../controllers/caseController'
import OutcomeController from '../controllers/outcomeController'
import StaticPageController from '../controllers/staticPageController'
import { asyncHandler } from '../utils/utils'

export default function routes({ auditService, userPreferencesService, courtCaseService }: Services): Router {
  const router = Router()

  const staticPageController = new StaticPageController(auditService)
  const courtController = new CourtController(userPreferencesService)
  const caseController = new CaseController(courtCaseService)
  const outcomesController = new OutcomeController(courtCaseService)

  router.get('/', asyncHandler(staticPageController.index))
  router.get('/my-courts', asyncHandler(courtController.index))
  router.get('/my-courts/edit', asyncHandler(courtController.edit))
  router.get('/my-courts/setup', asyncHandler(courtController.setup))
  router.post('/my-courts/add', asyncHandler(courtController.update))
  router.get('/my-courts/remove/:courtCode', asyncHandler(courtController.remove))
  router.post('/my-courts', asyncHandler(courtController.store))
  router.get('/select-court/:courtCode', asyncHandler(courtController.select))

  router.get('/:courtCode/cases', asyncHandler(caseController.index))

  router.get('/:courtCode/outcomes', asyncHandler(outcomesController.index))

  return router
}
