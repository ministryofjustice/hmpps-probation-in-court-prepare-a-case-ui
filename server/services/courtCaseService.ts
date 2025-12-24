import CourtCaseApiClient from '../data/courtCaseApiClient'

export default class UserPreferencesService {
  public client: CourtCaseApiClient

  constructor(client: CourtCaseApiClient) {
    this.client = client
  }

  getCases = async (): Promise<void> => {
    // todo: implement method.
  }
}
