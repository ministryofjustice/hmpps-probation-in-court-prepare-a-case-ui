import type { Request, Response, NextFunction } from "express"
import {BaseController} from "./baseController"

export default class StaticPageController extends BaseController {

  showUserGuide= async (req: Request, res: Response, next: NextFunction) => {
    return res.render('pages/user-guide')
  }
}
