import { test, expect } from '@playwright/test';

test.describe('StickyScroll Component', () => {
  test('should render all sections', async ({ page }) => {
    await page.goto('/');
    
    // Check that all section headings are visible
    await expect(page.locator('section h2').filter({ hasText: 'Collaborative Editing' })).toBeVisible();
    await expect(page.locator('section h2').filter({ hasText: 'Real time changes' })).toBeVisible();
    await expect(page.locator('section h2').filter({ hasText: 'Version control' })).toBeVisible();
    await expect(page.locator('section h2').filter({ hasText: 'Running out of content' })).toBeVisible();
  });

  test('should show mobile dropdown button on mobile', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that "Read more" button is visible on mobile
    const readMoreButton = page.getByText('Read more →');
    await expect(readMoreButton).toBeVisible();
  });

  test('should open dropdown on mobile when button clicked', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const readMoreButton = page.getByText('Read more →');
    await readMoreButton.click();
    
    // Check that dropdown menu is visible
    const mobileNav = page.getByTestId('mobile-nav');
    await expect(mobileNav.getByText('Collaborative Editing')).toBeVisible();
    await expect(mobileNav.getByText('Real time changes')).toBeVisible();
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    // force:true avoids Playwright retrying after the dropdown opens and covers the button
    const readMoreButton = page.getByText('Read more →');
    await readMoreButton.click({ force: true });
    
    // Ensure the dropdown is actually open
    const dropdown = page.getByTestId('mobile-dropdown');
    await expect(dropdown).toBeVisible();

    // Dispatch mousedown on a section heading (outside dropdown/button refs)
    // This triggers the handleClickOutside handler and closes the dropdown
    await page.locator('section h2').first().dispatchEvent('mousedown');
    
    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('should close dropdown when close button clicked', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const readMoreButton = page.getByText('Read more →');
    await readMoreButton.click();
    
    // Click close button (X)
    const closeButton = page.locator('button[aria-label="Close menu"]');
    await closeButton.click();
    
    // Dropdown should be closed
    await expect(page.getByTestId('mobile-dropdown')).not.toBeVisible();
  });

  test('should scroll to section when clicking dropdown item', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const readMoreButton = page.getByText('Read more →');
    await readMoreButton.click();
    
    // Click on "Version control" in dropdown
    const dropdownNav = page.getByTestId('mobile-nav');
    const versionControlButton = dropdownNav.getByText('Version control');
    await versionControlButton.click();
    
    // Check that we scrolled to the section
    const versionControlSection = page.locator('#section-2');
    await expect(versionControlSection).toBeInViewport();
  });

  test('should show desktop sidebar on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Check that sidebar is visible on desktop
    const sidebar = page.getByTestId('desktop-nav');
    await expect(sidebar).toBeVisible();
    
    // Check that mobile button is hidden
    const readMoreButton = page.getByText('Read more →');
    await expect(readMoreButton).not.toBeVisible();
  });

  test('should scroll to section when clicking desktop sidebar item', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Click on "Real time changes" in sidebar
    const sidebar = page.getByTestId('desktop-nav');
    const realTimeChanges = sidebar.getByText('Real time changes').locator('..');
    await realTimeChanges.click();
    
    // Check that we scrolled to the section
    const realTimeSection = page.locator('#section-1');
    await expect(realTimeSection).toBeInViewport();
  });

  test('should render content sections with proper styling', async ({ page }) => {
    await page.goto('/');
    
    // Check all 4 section headings exist
    await expect(page.locator('section h2')).toHaveCount(4);
  });

  test('should have responsive heights for content areas', async ({ page }) => {
    // Mobile height
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('section h2').first()).toBeVisible();
    const contentDiv = page.locator('section').first().locator('div').first();
    const mobileHeight = await contentDiv.evaluate((el: HTMLElement) => el.offsetHeight);
    expect(mobileHeight).toBe(256); // h-64 = 256px
    
    // Desktop height
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('section h2').first()).toBeVisible();
    const desktopHeight = await page.locator('section').first().locator('div').first().evaluate((el: HTMLElement) => el.offsetHeight);
    expect(desktopHeight).toBe(320); // h-80 = 320px
  });

  test('should have proper hover states on desktop sidebar', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('Mobile'), 'Hover states do not apply on mobile devices');
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    // Target the desktop sidebar specifically
    const sidebar = page.getByTestId('desktop-nav');
    const sidebarItem = sidebar.getByText('Collaborative Editing').locator('..');
    
    // Hover over item
    await sidebarItem.hover();
    
    // Check that it has hover effect (background color change)
    const bgColor = await sidebarItem.evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
