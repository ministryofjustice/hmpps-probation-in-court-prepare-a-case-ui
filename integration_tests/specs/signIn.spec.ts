import { expect, test } from '@playwright/test'
import hmppsAuth from '../mockApis/hmppsAuth'
import userPreferencesApi from '../mockApis/userPreferencesApi'

import { login, resetStubs } from '../testUtils'
import MyCourtsPage from '../pages/myCourtsPage'

test.describe('SignIn', () => {
  test.beforeEach(async () => {
    await userPreferencesApi.stubGetCourts()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Unauthenticated user directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await hmppsAuth.stubSignInPage()
    await page.goto('/sign-in')

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login(page, { name: 'A TestUser' })

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)

    await expect(myCourtsPage.usersName).toHaveText('A. Testuser')
  })

  test('Phase banner visible in header', async ({ page }) => {
    await login(page)

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)

    await expect(myCourtsPage.phaseBanner).toHaveText('dev')
  })

  test('User can sign out', async ({ page }) => {
    await login(page)

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)
    await myCourtsPage.signOut()

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('User can manage their details', async ({ page }) => {
    await login(page, { name: 'A TestUser' })

    await hmppsAuth.stubManageDetailsPage()

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)
    await myCourtsPage.clickManageUserDetails()

    await expect(page.getByRole('heading')).toHaveText('Your account details')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await login(page, { active: false })

    await expect(page.getByRole('heading')).toHaveText('Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await login(page, { name: 'A TestUser', active: false })

    await expect(page.getByRole('heading')).toHaveText('Sign in')

    await login(page, { name: 'Some OtherTestUser', active: true })

    const myCourtsPage = await MyCourtsPage.verifyOnPage(page)
    await expect(myCourtsPage.usersName).toHaveText('S. Othertestuser')
  })
})
