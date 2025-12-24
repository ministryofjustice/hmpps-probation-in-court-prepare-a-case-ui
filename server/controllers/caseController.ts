import type { Request, Response } from 'express'
import BaseController from './baseController'
import CourtCaseService from '../services/courtCaseService'

export default class CaseController extends BaseController {
  private readonly service: CourtCaseService

  constructor(service: CourtCaseService) {
    super()
    this.service = service
  }

  index = async (req: Request, res: Response): Promise<void> => {
    // todo: implement method
    const {
      params: { courtCode },
    } = req

    return res.render('pages/cases/index', { courtCode })
  }
}
