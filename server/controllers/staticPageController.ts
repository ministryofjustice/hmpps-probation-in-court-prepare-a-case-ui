import type { Request, Response } from 'express'
import BaseController from './baseController'
import AuditService from '../services/auditService'

export default class StaticPageController extends BaseController {
  private auditService: AuditService

  constructor(auditService: AuditService) {
    super()
    this.auditService = auditService
  }

  index = async (req: Request, res: Response): Promise<void> => {
    const { cookies } = req
    if (cookies?.currentCourt) {
      return res.redirect(302, `/${cookies.currentCourt}/cases`)
    }
    return res.redirect(302, '/my-courts')
  }

  showUserGuide = async (req: Request, res: Response) => {
    return res.render('pages/user-guide')
  }
}
