import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { UserPreferencesResponse } from '../@types/UserPreferencesResponse'
import { UserCourtsResponse } from '../@types/UserCourtsResponse'

export default class UserPreferencesApiClient extends RestClient {
  constructor() {
    super('User Preferences API', config.apis.userPreferencesApi, logger)
  }

  toJson(jsonString: string): object {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
  }

  toUserCourts(jsonString: string): UserCourtsResponse {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
  }

  toUserPreferences(jsonString: string): UserPreferencesResponse {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
  }

  async getCourts(userId: string, token: string): Promise<UserCourtsResponse> {
    const jsonString: string = await this.get<string>(
      {
        path: `/users/${userId}/preferences/courts`,
        headers: { Accept: 'application/json' },
      },
      asUser(token),
    )
    return this.toUserCourts(jsonString)
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
    return this.toUserPreferences(jsonString)
  }

  async updatePreferences(userId: string, preference: string, values: object, token: string): Promise<object> {
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
