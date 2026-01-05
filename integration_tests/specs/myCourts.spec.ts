import { expect, test } from '@playwright/test'
import userPreferencesApi from '../mockApis/userPreferencesApi'

import { login, resetStubs } from '../testUtils'
import MyCourtsPage from '../pages/myCourtsPage'

test.describe('MyCourts', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('A list of courts is visible on page', async ({ page }): Promise<void> => {
    await userPreferencesApi.stubGetCourts()
    await login(page)
    await page.goto('/my-courts')

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)

    await expect(myCourtsPage.courtSelection).toBeVisible()
  })
})
