// tests/scorePage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("ScorePage CRUD flows", () => {
  test.beforeEach(async ({ page }) => {
    // 실제로 ScorePage가 열리는 URL로 바꿔주세요
    await page.goto("http://localhost:3000/score");
  });

  test("should add a new student and show it in the table", async ({
    page,
  }) => {
    await page.click('button:has-text("학생 추가")');

    // 필수 입력란 채우기
    await page.fill('[data-testid="add-name"]', "테스트학생");
    await page.fill('[data-testid="add-phone"]', "010-9999-8888");
    await page.fill('[data-testid="add-birthday"]', "2005-05-05");

    // 완료 버튼 활성화 확인 후 클릭
    const addBtn = page
      .locator('button:has-text("완료")')
      .filter({ has: page.locator('[data-testid="add-name"]') });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();

    // 테이블에 새 학생이 보이는지 확인
    await expect(page.locator("table >> text=테스트학생")).toBeVisible();
  });

  test("should edit an existing student and reflect changes", async ({
    page,
  }) => {
    // 첫 번째 학생 이름 클릭해서 선택
    const firstStudentCell = page
      .locator("table tbody tr")
      .first()
      .locator("td")
      .nth(1);
    await firstStudentCell.click();

    await page.click('button:has-text("수정")');

    // 수정란 채우기
    await page.fill('[data-testid="edit-name"]', "수정된학생");
    await page.fill('[data-testid="edit-phone"]', "010-7777-6666");
    await page.fill('[data-testid="edit-birthday"]', "2004-04-04");

    // 완료 버튼 활성화 확인 후 클릭
    const editBtn = page
      .locator('button:has-text("완료")')
      .filter({ has: page.locator('[data-testid="edit-name"]') });
    await expect(editBtn).toBeEnabled();
    await editBtn.click();

    // 테이블에서 수정된 이름이 보이는지 확인
    await expect(page.locator("table >> text=수정된학생")).toBeVisible();
  });

  test("should delete the selected student and remove from table", async ({
    page,
  }) => {
    // 다이얼로그 자동 수락
    page.on("dialog", (dialog) => dialog.accept());

    // 삭제하려는 학생 선택
    const rowToDelete = page.locator("table tbody tr").first();
    const name = await rowToDelete.locator("td").nth(1).innerText();
    await rowToDelete.locator("td").nth(1).click();

    // 삭제 버튼 클릭
    const deleteBtn = page.getByRole("button", { name: "삭제" });
    await deleteBtn.click();

    // 확인 대화상자 띄워지고 자동 수락 후 해당 이름이 사라졌는지 확인
    await expect(page.locator(`table >> text=${name}`)).not.toBeVisible();
  });
});
