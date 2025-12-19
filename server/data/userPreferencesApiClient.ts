import { RestClient, asSystem, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class UserPreferencesApiClient extends RestClient {

  constructor(authenticationClient: AuthenticationClient) {
    super('User Preferences API', config.apis.userPreferencesApi, logger, authenticationClient)
  }

  //TODO: define the response objects.
  async getCourts(userId: string, token: string):Promise<Object> {
    const jsonString: string = await this.get<string>({
      path: `/users/${userId}/preferences/courts`,
      headers: { 'Accept': 'application/json' },
    }, asUser(token))
    return JSON.parse(jsonString)
  }

  async updateCourts(userId: string, courts: []): Promise<Object> {
    const jsonString: string = await this.put<string>({
      path: `/users/${userId}/preferences/courts`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({items: courts})
    }, asSystem())
    return JSON.parse(jsonString)
  }

  async getPreferences(userId: string, preference: string, token: string) : Promise<Object> {
    const jsonString: string = await this.get<string>({
      path: `/users/${userId}/preferences/${preference}`,
      headers: { 'Accept': 'application/json' },
    }, asUser(token))
    return JSON.parse(jsonString)
  }

  async updatePreferences(userId: string, preference: string, values:string[], token: string) : Promise<Object> {
    const jsonString: string = await this.put<string>({
      path: `/users/${userId}/preferences/${preference}`,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({items: values})
    }, asUser(token))
    return JSON.parse(jsonString)
  }
}
