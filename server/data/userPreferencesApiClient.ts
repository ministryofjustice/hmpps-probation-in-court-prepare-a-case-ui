import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { UserPreferencesResponse } from '../@types/UserPreferencesResponse'

export default class UserPreferencesApiClient extends RestClient {
  constructor() {
    super('User Preferences API', config.apis.userPreferencesApi, logger)
  }

  toJson(jsonString: string): UserPreferencesResponse {
    if (typeof jsonString === 'string') {
      return JSON.parse(jsonString)
    }
    return jsonString
  }

  async getCourts(userId: string, token: string): Promise<UserPreferencesResponse> {
    const jsonString: string = await this.get<string>(
      {
        path: `/users/${userId}/preferences/courts`,
        headers: { Accept: 'application/json'},
      },
      asUser(token),
    )
    return this.toJson(jsonString)
  }

  async updateCourts(userId: string, courts: string[], token: string): Promise<object> {
    const jsonString: string = await this.put<string>(
      {
        path: `/users/${userId}/preferences/courts`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ items: courts }),
      },
      asUser(token),
    )
    return this.toJson(jsonString)
  }

  async getPreferences(userId: string, preference: string, token: string): Promise<UserPreferencesResponse> {
    const jsonString: string = await this.get<string>(
      {
        path: `/users/${userId}/preferences/${preference}`,
        headers: { Accept: 'application/json' },
      },
      asUser(token),
    )
    return this.toJson(jsonString)
  }

  async updatePreferences(userId: string, preference: string, values: Object, token: string): Promise<object> {
    const jsonString: string = await this.put<string>(
      {
        path: `/users/${userId}/preferences/${preference}`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ items: values }),
      },
      asUser(token),
    )
    return this.toJson(jsonString)
  }
}
