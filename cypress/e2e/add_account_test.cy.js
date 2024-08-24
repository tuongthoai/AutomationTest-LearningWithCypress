describe("Testing the account creation", () => {
  beforeEach(() => {
    cy.fixture("../data/add_account_data.json").then((data) => {
      cy.wrap(data).as("testData");
    });
  });

  const deleteAccountForInsert = () => {
    // Target the table directly to limit the scope
    cy.get(
      ".MuiTableBody-root > :nth-child(1) > :nth-child(2) > .MuiBox-root"
    ).then(($val) => {
      const txt = $val.text().trim();
      if (txt === "abc@gmail.com") {
        cy.wrap($val).then(() => {
          cy.get(
            ".MuiTableBody-root > :nth-child(1) > :nth-child(6) > .MuiBox-root > .checkbox"
          ).click();
          cy.wait(500);
          cy.get(".css-1dyyv51 > .MuiButtonBase-root").click();
          cy.wait(500);
          cy.get(".swal2-confirm").click();
        });
      }
    });
  };

  const fillInputData = (testCase) => {
    cy.get(
      '[href="/admin/account-management"] > .MuiListItem-root > .MuiBox-root'
    ).click();

    deleteAccountForInsert();

    cy.get("button").contains("Thêm").click();

    // Fill in the form fields using the 'id' starts with selector
    if (testCase.data["Họ tên"]) {
      cy.get(".MuiBox-root.css-1qoos23")
        .find('input[placeholder="Nhập họ tên chủ tài khoản"]')
        .clear({ force: true })
        .type(testCase.data["Họ tên"]); // For Họ tên input
    }

    if (testCase.data["Email"]) {
      cy.get(".MuiBox-root.css-1qoos23")
        .find('input[placeholder="Nhập email"]')
        .clear({ force: true })
        .type(testCase.data["Email"]); // For Email input
    }

    if (testCase.data["Vai trò"]) {
      if (testCase.data["Vai trò"] === "Trống") {
        cy.get(".MuiBox-root.css-1qoos23")
          .find('input[placeholder="Chọn vai trò"]')
          .click()
          .type(testCase.data["Vai trò"])
          .type("{enter}") // For Vai trò input
          .clear();
      } else {
        cy.get(".MuiBox-root.css-1qoos23")
          .find('input[placeholder="Chọn vai trò"]')
          .click()
          .type(testCase.data["Vai trò"])
          .type("{enter}"); // For Vai trò input

        cy.get(".MuiAutocomplete-popper li")
          .contains(testCase.data["Vai trò"])
          .click();
      }
    }
    // Click "Xác nhận" button

    cy.get(".css-uv3wtg-MuiButtonBase-root-MuiButton-root").click();
  };

  const checkResult = (testCase) => {
    if (testCase.expectedResult === "success") {
      // cy.wait(1000);
      cy.contains("Thêm tài khoản thành công").should("be.visible");
    } else {
      if (testCase.expectedResult === "failure") {
        if (testCase.failureType === "validation") {
          if (testCase.data["Họ tên"].length == 0) {
            cy.contains("Họ và tên không được rỗng").should("be.visible");
            cy.get(".css-13cnr6h-MuiButtonBase-root-MuiButton-root").click();
            cy.wait(500);
            cy.get(".swal2-deny").click();
          }

          if (testCase.data["Email"].length == 0) {
            cy.contains("Email không được rỗng").should("be.visible");
            cy.get(".css-13cnr6h-MuiButtonBase-root-MuiButton-root").click();
            cy.wait(500);

            cy.get(".swal2-deny").click();
          }

          if (testCase.data["Vai trò"] === "Trống") {
            cy.contains("Vui lòng chọn ít nhất 1 giá trị").should("be.visible");
            cy.get(".css-13cnr6h-MuiButtonBase-root-MuiButton-root").click();
            cy.wait(500);

            cy.get(".swal2-deny").click();
          }
        } else {
          cy.wait(500);
          cy.get(".swal2-popup")
            .should("contain", "Email không hợp lệ!")
            .should("be.visible");
          cy.get(".swal2-container").click();
          cy.wait(500);
          cy.get(".css-13cnr6h-MuiButtonBase-root-MuiButton-root").click();
          cy.wait(500);

          cy.get(".swal2-deny").click();
        }
      }
    }
  };

  const test = (eachData) => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    fillInputData(eachData);

    checkResult(eachData);
  };

  let testResults = [];

  it("Create an account with all valid input fields.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[0]);
    });
  });

  it("Create an account with an empty full name", () => {
    cy.get("@testData").then((testData) => {
      test(testData[1]);
    });
  });
  
  it("Create an account with a length 101 username.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[2]);
    });
  });

  it("Create an account with invalid email.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[3]);
    });
  });

  it("Create an account with a length 101 email.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[4]);
    });
  });

  it("Create an account with an empty email.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[5]);
    });
  });

  it("Create an account with an empty role.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[6]);
    });
  });

  it("Create an account with a length 2 username.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[7]);
    });
  });

  it("Create an account with a length 1 username.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[8]);
    });
  });

  it("Create an account with a length 100 username.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[9]);
    });
  });

  it("Create an account with a length 99 email.", () => {
    cy.get("@testData").then((testData) => {
      test(testData[10]);
    });
  });

  after(() => {
    cy.log("Test Results:", testResults);
    const failedTests = testResults.filter((r) => r.result === "fail");
    if (failedTests.length > 0) {
      throw new Error(
        `Some tests failed: ${JSON.stringify(failedTests, null, 2)}`
      );
    }
  });
});
