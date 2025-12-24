import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class CourtCaseUserPreferencesApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Court Case API', config.apis.courtCaseServiceApi, logger, authenticationClient)
  }

  async getCases(): Promise<void> {
    // TODO: implement method.
  }
}
