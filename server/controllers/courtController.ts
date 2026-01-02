import type { Request, Response } from 'express'
import BaseController from './baseController'
import UserPreferencesService from '../services/userPreferencesService'
import config from '../config'
import { isCourt } from '../data/courts'
import logger from '../../logger'

export default class CourtController extends BaseController {
  private readonly service: UserPreferencesService

  constructor(service: UserPreferencesService) {
    super()
    this.service = service
  }

  index = async (req: Request, res: Response): Promise<void> => {
    const { session } = req
    const { userId, token } = res.locals.user
    let userCourts: string[] = []
    try {
      const response = await this.service.getCourts(userId, token)
      userCourts = response.items
    } catch (error) {
      logger.error(`Error calling getCourts for userId '${userId}':`, error)
      req.flash('serverError', 'Unable to fetch your courts list, please try again later.')

      return res.render('pages/courts/index', {
        chosenCourts: userCourts,
        availableCourts: config.availableCourts,
        serverError: req.flash('serverError'),
        formError: req.flash('formError'),
      })
    }

    session.courts = userCourts

    if (session.courts.length < 1) {
      return res.status(302).redirect('/my-courts/setup')
    }

    return res.render('pages/courts/index', {
      chosenCourts: userCourts,
      availableCourts: config.availableCourts,
      serverError: req.flash('serverError'),
      formError: req.flash('formError'),
    })
  }

  select = async (req: Request, res: Response): Promise<void> => {
    const {
      params: { courtCode },
    } = req

    return res.status(201).cookie('currentCourt', courtCode).redirect(302, `/${courtCode}/cases`)
  }

  edit = async (req: Request, res: Response): Promise<void> => {
    const { session } = req
    return res.render('pages/courts/edit', {
      state: 'edit',
      serverError: req.flash('serverError'),
      formError: req.flash('formError'),
      availableCourts: config.availableCourts,
      chosenCourts: session.courts,
    })
  }

  setup = async (req: Request, res: Response): Promise<void> => {
    const { session } = req
    return res.render('pages/courts/edit', {
      state: 'setup',
      serverError: req.flash('serverError'),
      formError: req.flash('formError'),
      availableCourts: config.availableCourts,
      chosenCourts: session.courts,
    })
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const {
      session,
      body: { court, state },
    } = req
    const urlPath = this.getUrlPath(state)

    if (!isCourt(court)) {
      req.flash('formError', 'Please choose a court.')
      return res.redirect(302, `/${urlPath}/?error=true`)
    }

    let courtsList: string[] = []
    if (Array.isArray(session.courts)) {
      courtsList = session.courts
    }
    if (courtsList.indexOf(court) === -1) {
      courtsList.push(court)
    }
    session.courts = courtsList

    return res.redirect(302, `/${urlPath}/?success=true`)
  }

  remove = async (req: Request, res: Response): Promise<void> => {
    const {
      session,
      params: { courtCode, state },
    } = req
    const urlPath = this.getUrlPath(state)
    if (!isCourt(courtCode)) {
      return res.redirect(302, `/${urlPath}/`)
    }
    if (session.courts.indexOf(courtCode) !== -1) {
      const index = session.courts.indexOf(courtCode)
      session.courts.splice(index, 1)
    }

    return res.redirect(302, `/${urlPath}/?success=true`)
  }

  store = async (req: Request, res: Response): Promise<void> => {
    const {
      session,
      params: { state },
    } = req
    const urlPath = this.getUrlPath(state)
    const { userId, token } = res.locals.user

    if (!Object.prototype.hasOwnProperty.call(session, 'courts')) {
      req.flash('formError', 'Please choose a court.')
      return res.redirect(302, `/${urlPath}/?success=false`)
    }

    try {
      await this.service.updateCourts(userId, session.courts, token)
    } catch (error) {
      logger.error(`Error calling getCourts for userId '${userId}':`, error)
      req.flash('serverError', 'Unable to store your courts list, please try again later.')
      return res.redirect(302, `/${urlPath}/?success=false`)
    }

    return res.redirect(302, `/my-courts/?success=true`)
  }

  private getUrlPath(state: string): string {
    const urlPath: string = 'my-courts'
    const verb: string = state === 'setup' ? 'setup' : 'edit'

    return `${urlPath}/${verb}`
  }
}
