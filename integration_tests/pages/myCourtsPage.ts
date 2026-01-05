import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class MyCourtsPage extends AbstractPage {
  readonly header: Locator

  readonly courtSelection: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'My courts' })
    this.courtSelection = page.getByText("Sheffield Magistrates' Court")
  }

  static async verifyOnPage(page: Page): Promise<MyCourtsPage> {
    const myCourtsPage = new MyCourtsPage(page)
    await expect(myCourtsPage.header).toBeVisible()
    return myCourtsPage
  }
}
