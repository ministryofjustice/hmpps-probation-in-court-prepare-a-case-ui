import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import UserCourtController from '../controllers/userCourtController'
import CourtCaseController from '../controllers/courtCaseController'
import CaseOutcomesController from '../controllers/caseOutcomeController'
import {asyncHandler} from "../utils/utils";

export default function routes({
                                 auditService,
                                 exampleService,
                                 userPreferencesService,
                                 courtCaseService
}: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index', { currentTime })
  })

  const courtController = new UserCourtController(userPreferencesService)
  const courtCaseController = new CourtCaseController(courtCaseService)
  const caseOutcomesController = new CaseOutcomesController(courtCaseService)

  router.get('/my-courts', asyncHandler(courtController.index))
  router.get('/my-courts/edit', asyncHandler(courtController.edit))
  router.get('/my-courts/setup', asyncHandler(courtController.setup))
  router.put('/my-courts', asyncHandler(courtController.update))

  return router
}
