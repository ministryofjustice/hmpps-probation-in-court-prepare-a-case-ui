import UserPreferencesApiClient from '../data/userPreferencesApiClient'
import UserPreferencesService from './userPreferencesService'
import createUserToken from "../testutils/createUserToken";
import {UserPreferencesResponse} from "../@types/UserPreferencesResponse";
import {UserCourtsResponse} from "../@types/UserCourtsResponse";

jest.mock('../data/userPreferencesApiClient')

describe('UserPreferencesService', () => {
  const apiClient = new UserPreferencesApiClient() as jest.Mocked<UserPreferencesApiClient>
  let userPreferencesService: UserPreferencesService

  beforeEach(() => {
    userPreferencesService = new UserPreferencesService(apiClient)
  })

  it('should call getCourts on the api client and return its result', async () => {
    const expectedCourts: UserCourtsResponse = {items: ['B14LO', 'B34JS', 'B20BL']}
    const userId = "608955ae-52ed-44cc-884c-011597a77949"
    const userToken = createUserToken([])

    apiClient.getCourts.mockResolvedValue(expectedCourts)

    const result = await userPreferencesService.getCourts(userId, userToken)

    expect(apiClient.getCourts).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedCourts)
  })

  it('should call updateCourts on the api client and return its result', async () => {
    const courts = ['B14LO', 'B34JS', 'B20BL']
    const userId = "608955ae-52ed-44cc-884c-011597a77949"
    const userToken = createUserToken([])

    apiClient.updateCourts.mockResolvedValue({})

    const result = await userPreferencesService.updateCourts(userId, courts, userToken)

    expect(apiClient.updateCourts).toHaveBeenCalledTimes(1)
    expect(result).toEqual({})
  })

  it('should call getPreferences on the api client and return its result', async () => {
    const expectedPreferences: UserPreferencesResponse = {items: {'page': '10', 'casesPerPage': '10'}}
    const userId = "608955ae-52ed-44cc-884c-011597a77949"
    const userToken = createUserToken([])

    apiClient.getPreferences.mockResolvedValue(expectedPreferences)

    const result = await userPreferencesService.getPreferences(userId, 'caseFilters', userToken)

    expect(apiClient.getPreferences).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedPreferences)
  })

  it('should call updatePreferences on the api client and return its result', async () => {
    const preferenceValues = {'page': '10', 'casesPerPage': '10'}
    const userId = "608955ae-52ed-44cc-884c-011597a77949"
    const userToken = createUserToken([])

    apiClient.updatePreferences.mockResolvedValue({})

    const result = await userPreferencesService.updatePreferences(userId, 'caseFilters', preferenceValues, userToken)

    expect(apiClient.updatePreferences).toHaveBeenCalledTimes(1)
    expect(result).toEqual({})
  })

})
