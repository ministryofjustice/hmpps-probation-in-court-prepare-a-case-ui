import type { Request, Response, NextFunction } from "express"
import {BaseController} from "./baseController"
import CourtCaseService from '../services/courtCaseService'

export default class CourtCaseController extends BaseController {

  private readonly service: CourtCaseService

  constructor(service: CourtCaseService) {
    super();
    this.service = service
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    //todo: implement method
  }
}
