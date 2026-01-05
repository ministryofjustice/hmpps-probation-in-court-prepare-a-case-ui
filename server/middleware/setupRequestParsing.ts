import express, { Router } from 'express'
import cookieParser from 'cookie-parser'

export default function setUpWebRequestParsing(): Router {
  const router = express.Router()
  router.use(express.json())
  router.use(cookieParser())
  router.use(express.urlencoded({ extended: true }))
  return router
}
