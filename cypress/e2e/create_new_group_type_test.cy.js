describe("Testing the group type creation", () => {
  beforeEach(() => {
    cy.fixture("../data/create_new_group_type_test.json").then((data) => {
      cy.wrap(data).as("testData");
    });
  });

  let testResults = [];

  const addTestResult = (resultStatus, test_case_cnt) => {
    testResults.push({ resultStatus, test_case_cnt });
  };

  const fillInTheForm = (each) => {
    cy.get(
      '[href="/admin/group-category"] > .MuiListItem-root > .MuiBox-root'
    ).click();
    cy.get(".css-j60lp5-MuiButtonBase-root-MuiButton-root").click();

    // Fill in the "Tên loại nhóm" field
    if (each["GroupTypeName"]) {
      cy.get('input[placeholder="Nhập tên loại nhóm"]').type(
        each["GroupTypeName"]
      );
    }

    // Fill in the "Mô tả" field
    if (each["Description"]) {
      cy.get('textarea[placeholder="Nhập mô tả cho loại nhóm"]').type(
        each["Description"]
      );
    }

    cy.get(":nth-child(3) > .MuiButtonBase-root").click();
    cy.get(".css-16gkg8z > .MuiButtonBase-root > .MuiTypography-root").click();
    // Find the file input and attach the file
    cy.get('input[type="file"]').selectFile(each["Icon"]);
    if (
      each.TestCaseID === "TC-T-022" ||
      each.TestCaseID === "TC-T-023" ||
      each.TestCaseID === "TC-T-024" ||
      each.TestCaseID === "TC-T-025"
    ) {
      cy.contains(each.ExpectedResult.Message).should("be.visible");
    } else {
      cy.wait(500);
      cy.get(
        ":nth-child(7) > .group-modal__container > .css-1gjulr8 > .css-uv3wtg-MuiButtonBase-root-MuiButton-root"
      ).click();

      // Select "Quyền ứng dụng"
      cy.get('input[placeholder="Chọn các quyền ứng dụng"]').click();
      cy.get('li[data-option-index="0"]').click(); // This selects the first option; adjust as necessary
      cy.get("body").type("{esc}");
      cy.contains("button", "Xác nhận").click();
    }
  };

  const escapeForm = () => {
    cy.visit("/admin");
  };

  const test = (each) => {
    fillInTheForm(each);

    if (each.ExpectedResult.State === "Success") {
      cy.contains("Thêm loại nhóm thành công").should("be.visible");
      addTestResult("Success", 0);
    } else {
      if (
        each.TestCaseID === "TC-T-022" ||
        each.TestCaseID === "TC-T-023" ||
        each.TestCaseID === "TC-T-024" ||
        each.TestCaseID === "TC-T-025"
      ) {
      } else {
        cy.contains(each.ExpectedResult.Message).should("be.visible");
      }
    }
  };

  // it("add new group type", () => {
  //   Cypress.on("fail", (error, runnable) => {
  //     return false;
  //   });

  //   cy.viewport(1536, 960);
  //   cy.login_using_token();
  //   cy.visit("/admin");

  //   cy.get("@testData").then((testData) => {
  //     for (var i = 0; i < testData.length; ++i) {
  //       if (testData.TestCaseID === "TC-T-024") {
  //         addTestResult("FAILED", testData.TestCaseID);
  //       } else {
  //         test(testData[i]);
  //       }
  //     }
  //   });
  // });

  it("TC-T-012. Validate that the form shows an error when the group type name is empty", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[0]);
    });
  });

  it("TC-T-013. Verify that the form successfully submits with a single-character group type name", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[1]);
    });
  });

  it("TC-T-014. Check that the form submits successfully with a two-character group type name.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[2]);
    });
  });

  it("TC-T-015. Ensure the form handles and submits a group type name with exactly 50 characters.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[3]);
    });
  });

  it("TC-T-016. Confirm that the form trims and submits a group type name with more than 50 characters.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[4]);
    });
  });

  it("TC-T-017. Verify that the form submits successfully with valid inputs.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[5]);
    });
  });

  it("TC-T-018. Ensure the form submits successfully when the description is left empty.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[6]);
    });
  });

  it("TC-T-019. Verify that the form submits successfully with a zero-byte image", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[7]);
    });
  });

  it("TC-T-020. Check that the form handles and submits with a valid image of 0.5MB.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[8]);
    });
  });
  it("TC-T-021. Verify successful submission with a valid image of 1.0MB.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[9]);
    });
  });
  it("TC-T-022. Ensure the form shows an error when submitting an invalid image of 1.5MB.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[10]);
    });
  });
  it("TC-T-023. Validate error handling when a non-supported file type is used for the icon.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[11]);
    });
  });
  it("TC-T-024. Ensure the form shows an error when the icon file has an incorrect extension.", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[12]);
    });
  });
  it("TC-T-025. Check error handling when the icon file is in an unsupported format like HEIC", () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");

    cy.get("@testData").then((testData) => {
      test(testData[13]);
    });
  });
});
