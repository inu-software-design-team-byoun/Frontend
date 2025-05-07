// tests/scorePage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("성적 탭 CRUD Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3012/");

    // ✅ 모든 테스트에서 alert 자동 수락
    page.on("dialog", async (dialog) => {
      console.log("Alert message:", dialog.message());
      await dialog.accept();
    });
  });

  test("학생을 추가하면 테이블에 표시", async ({ page }) => {
    // alert 자동 수락
    page.on("dialog", (dialog) => dialog.accept());

    await page.getByRole("button", { name: "학생 추가" }).click();
    await page.fill('[data-testid="add-name"]', "테스트학생");
    await page.fill('[data-testid="add-phone"]', "010-9999-9999");
    await page.fill('[data-testid="add-birthday"]', "2005-05-05");

    const addBtn = page.getByRole("button", { name: "완료" });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();

    // GET 학생 목록 (refresh) 호출 대기
    await page.waitForResponse(
      (resp) =>
        resp.request().method() === "GET" &&
        resp.url().includes("/studentsList") &&
        resp.status() === 200
    );

    await expect(page.getByRole("cell", { name: "테스트학생" })).toBeVisible();
  });

  test("학생 정보를 수정하면 테이블에 반영", async ({ page }) => {
    // alert 자동 수락
    page.on("dialog", (dialog) => dialog.accept());

    const firstNameCell = page
      .locator("table tbody tr")
      .first()
      .locator("td")
      .nth(1);
    await firstNameCell.click();
    await page.getByRole("button", { name: "수정" }).click();

    await page.fill('[data-testid="edit-name"]', "수정된학생");
    await page.fill('[data-testid="edit-phone"]', "010-7777-6666");
    await page.fill('[data-testid="edit-birthday"]', "2004-04-04");

    const editBtn = page.getByRole("button", { name: "완료" });
    await expect(editBtn).toBeEnabled();
    await editBtn.click();

    // GET 학생 목록 (refresh) 호출 대기
    await page.waitForResponse(
      (resp) =>
        resp.request().method() === "GET" &&
        resp.url().includes("/studentsList") &&
        resp.status() === 200
    );

    await expect(page.getByRole("cell", { name: "수정된학생" })).toBeVisible();
  });

  test("학생을 삭제하면 테이블에서 제거", async ({ page }) => {
    // 삭제 confirm 자동 수락
    page.on("dialog", (dialog) => dialog.accept());

    const firstRow = page.locator("table tbody tr").first();
    const studentName = await firstRow.locator("td").nth(1).innerText();
    await firstRow.locator("td").nth(1).click();

    await page.getByRole("button", { name: "삭제" }).click();

    await expect(
      page.locator(`table >> text=${studentName}`)
    ).not.toBeVisible();
  });

  test("학년과 반을 변경하면 새로운 데이터 로딩", async ({ page }) => {
    const selectBox = page.locator("select").nth(1);
    await selectBox.selectOption("2");
    await expect(page.locator("tbody tr")).not.toHaveCount(0);
  });

  test("학생 클릭 시 상세 정보 패널이 갱신", async ({ page }) => {
    const row = page.locator("table tbody tr").first();
    const name = await row.locator("td").nth(1).innerText();
    await row.locator("td").nth(1).click();

    await page.getByRole("button", { name: "수정" }).click();
    const nameInput = page.locator('[data-testid="edit-name"]');

    await expect(nameInput).toHaveValue(name);
  });
});
