import CourtCaseApiClient from '../data/courtCaseApiClient'

export default class UserPreferencesService {

  public client: CourtCaseApiClient

  constructor(client: CourtCaseApiClient) {
    this.client = client
  }

  getCases = async (courtId: string): Promise<any> => {
    //todo: implement method.
  }
}
