import { dataAccess } from '../data'
import AuditService from './auditService'
import UserPreferencesService from './userPreferencesService'
import CourtCaseService from './courtCaseService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, userPreferencesApiClient, courtCaseApiClient } =
    dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    userPreferencesService: new UserPreferencesService(userPreferencesApiClient),
    courtCaseService: new CourtCaseService(courtCaseApiClient),
  }
}

export type Services = ReturnType<typeof services>
