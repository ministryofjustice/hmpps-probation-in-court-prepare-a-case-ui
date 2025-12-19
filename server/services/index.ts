import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'
import UserPreferencesService from './userPreferencesService'
import CourtCaseService from './courtCaseService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    exampleApiClient,
    userPreferencesApiClient,
    courtCaseApiClient
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    userPreferencesService: new UserPreferencesService(userPreferencesApiClient),
    courtCaseService: new CourtCaseService(courtCaseApiClient)
  }
}

export type Services = ReturnType<typeof services>
