import type { Request, Response, NextFunction } from "express"
import {BaseController} from "./baseController"
import UserPreferencesService from '../services/userPreferencesService'

export default class UserCourtController extends BaseController {

  private readonly service: UserPreferencesService

  constructor(service: UserPreferencesService) {
    super();
    this.service = service
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    const { session } = req
    const {userId, token} = res.locals.user
    const userCourts = await this.service.getCourts(userId, token)

    if (userCourts.isError) {
      //todo: log errors
      return res.render('pages/error', { status: userCourts.status || 500 })
    }

    session.courts = userCourts

    if (session.courts.length > 1) {
      return res.status(302).redirect('/my-courts/setup')
    }

    return res.render('pages/courts/index', {courts: userCourts})
  }

  edit = async (req: Request, res: Response, next: NextFunction) => {
    return res.render('pages/courts/edit', {state: 'edit'})
  }

  setup = async (req: Request, res: Response, next: NextFunction) => {
    return res.render('pages/courts/edit', {state: 'setup'})
  }

  update = async(req: Request, res: Response, next: NextFunction) => {
    //TODO: implement method:
    // validate data.
    // send to api.
    // handle response.
    // flash the session.
    // return response.
  }
}
