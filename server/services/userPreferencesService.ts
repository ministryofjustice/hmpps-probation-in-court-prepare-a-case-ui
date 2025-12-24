import UserPreferencesApiClient from '../data/userPreferencesApiClient'
import config from '../config'
import { UserPreferencesResponse } from '../@types/UserPreferencesResponse'

export default class UserPreferencesService {
  public client: UserPreferencesApiClient

  constructor(client: UserPreferencesApiClient) {
    this.client = client
  }

  getCourts = async (userId: string, token: string): Promise<UserPreferencesResponse> => {
    return this.client.getCourts(userId, token)
  }

  updateCourts = async (userId: string, courts: string[]): Promise<object> => {
    return this.client.updateCourts(userId, courts)
  }

  getPreferences = async (userId: string, preference: string, token: string): Promise<UserPreferencesResponse> => {
    return this.client.getPreferences(userId, preference, token)
  }

  // TODO: find better solution than passing the token as param on every request
  updatePreferences = async (userId: string, preference: string, values: [], token: string) => {
    return this.client.updatePreferences(userId, preference, values, token)
  }

  getFilters = async (userId: string, filterType: string, token: string) => {
    const deconstructPersistentFilters = (userPreferences: UserPreferencesResponse) => {
      if (!userPreferences.items) {
        return {}
      }

      const filters = {}
      let validDate: Date | null = null
      let valid = false
      const today = new Date()

      const splitItem = (item: string) => {
        return item.split('=')
      }

      userPreferences.items.forEach((item: string) => {
        const [key, value] = splitItem(item)

        if (key === 'validDate') {
          validDate = new Date(value)
        } else if (Object.prototype.hasOwnProperty.call(filters, key)) {
          // @ts-expect-error is necessary as TS doesn't like us accessing properties with unknown names
          const currentValue: string = filters[key]

          if (Array.isArray(currentValue)) {
            currentValue.push(value)
          } else {
            // @ts-expect-error is necessary as TS doesn't like us accessing properties with unknown names
            filters[key] = [currentValue, value]
          }
        } else {
          // @ts-expect-error is necessary as TS doesn't like us accessing properties with unknown names
          filters[key] = value
        }
      })

      if (
        validDate &&
        validDate.getDate() === today.getDate() &&
        validDate.getMonth() === today.getMonth() &&
        validDate.getFullYear() === today.getFullYear()
      ) {
        valid = true
      }

      return [filters, valid]
    }

    const preferences = await this.client.getPreferences(userId, filterType, token)

    // @ts-expect-error is necessary as TS doesn't like us accessing properties with unknown names
    const [userPreferenceFilters, valid] = deconstructPersistentFilters(preferences)

    if (valid && config.features.persistFilters === 'true') {
      return userPreferenceFilters
    }

    return {}
  }

  setFilters = async (userId: string, filterType: string, filters: [], token: string) => {
    const constructPersistentFilter = (queryParams: object) => {
      const queryArray = []

      Object.keys(queryParams).forEach((key: string) => {
        // @ts-expect-error is necessary as TS doesn't like us accessing properties with unknown names
        const value: string = queryParams[key]
        if (Array.isArray(value)) {
          value.forEach(itemValue => {
            queryArray.push(`${key}=${itemValue}`)
          })
        } else {
          queryArray.push(`${key}=${value}`)
        }
      })

      // set the valid day
      queryArray.push(`validDate=${new Date()}`)

      return queryArray
    }

    const persistentFilters: string[] = constructPersistentFilter(filters)
    await this.client.updatePreferences(userId, filterType, persistentFilters, token)
  }
}
