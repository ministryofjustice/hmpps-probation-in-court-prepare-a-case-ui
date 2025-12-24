import type { Request, Response } from 'express'
import {BaseController} from './baseController'
import AuditService, {Page} from '../services/auditService'
import ExampleService from '../services/exampleService'

export default class StaticPageController extends BaseController {

  private auditService: AuditService
  private exampleService: ExampleService

  constructor(auditService: AuditService, exampleService: ExampleService) {
    super()
    this.auditService = auditService
    this.exampleService = exampleService
  }

  index= async (req: Request, res: Response): Promise<void> => {
    await this.auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const currentTime = await this.exampleService.getCurrentTime()
    return res.render('pages/index', { currentTime })
  }

  showUserGuide= async (req: Request, res: Response) => {
    return res.render('pages/user-guide')
  }
}
