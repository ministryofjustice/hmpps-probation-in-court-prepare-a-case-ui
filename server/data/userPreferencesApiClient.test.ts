import nock from 'nock'
import UserPreferencesApiClient from './userPreferencesApiClient'
import config from '../config'
import createUserToken from "../testutils/createUserToken";

describe('UserPreferencesApiClient', () => {

  let apiClient: UserPreferencesApiClient

  beforeEach(() => {
    apiClient = new UserPreferencesApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getCourts', () => {
    it('makes a GET request to /users/${userId}/preferences/courts for the users courts', async () => {
      const userId = "608955ae-52ed-44cc-884c-011597a77949"
      const userToken = createUserToken([])

      nock(config.apis.userPreferencesApi.url)
        .get(`/users/${userId}/preferences/courts`)
        .matchHeader('authorization', `Bearer ${userToken}`)
        .reply(200, { items: ['B14LO', 'B34JS', 'B20BL'] }) // Sheffield, Northampton, Birmingham

      const response = await apiClient.getCourts(userId, userToken)

      expect(response).toEqual({ items: ['B14LO', 'B34JS', 'B20BL'] })
    })
  })

  describe('updateCourts', () => {
    it('makes a PUT request to /users/${userId}/preferences/courts', async () => {
      const userId = "608955ae-52ed-44cc-884c-011597a77949"
      const userToken = createUserToken([])
      const courts = ['B14LO', 'B34JS', 'B20BL'];

      nock(config.apis.userPreferencesApi.url)
        .put(`/users/${userId}/preferences/courts`, {items: courts})
        .matchHeader('authorization', `Bearer ${userToken}`)
        .reply(200, {})

      const response = await apiClient.updateCourts(userId, courts, userToken)

      expect(response).toEqual({})
    })
  })

  describe('getPreferences', () => {
    it('makes a GET request to /users/${userId}/preferences/${preference} for the users preferences', async () => {
      const userId = "608955ae-52ed-44cc-884c-011597a77949"
      const userToken = createUserToken([])
      const preference = 'caseFilters'

      nock(config.apis.userPreferencesApi.url)
        .get(`/users/${userId}/preferences/${preference}`)
        .matchHeader('authorization', `Bearer ${userToken}`)
        .reply(200, { items: {'page': '10', 'casesPerPage': '10'} })

      const response = await apiClient.getPreferences(userId, preference, userToken)

      expect(response).toEqual({ items: {'page': '10', 'casesPerPage': '10'} })
    })
  })

  describe('updatePreferences', () => {
    it('makes a PUT request to /users/${userId}/preferences', async () => {
      const userId = "608955ae-52ed-44cc-884c-011597a77949"
      const userToken = createUserToken([])
      const preference = 'caseFilters'
      const values = {'page': '10', 'casesPerPage': '10'}

      nock(config.apis.userPreferencesApi.url)
        .put(`/users/${userId}/preferences/${preference}`, {items: values})
        .matchHeader('authorization', `Bearer ${userToken}`)
        .reply(200, {})

      const response = await apiClient.updatePreferences(userId, 'caseFilters', values, userToken)

      expect(response).toEqual({})
    })
  })
})
