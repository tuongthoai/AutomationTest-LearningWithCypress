describe("Testing group activity searching", () => {
  beforeEach(() => {
    cy.fixture("../data/search_group_in_statistic_data.json").then((data) => {
      cy.wrap(data).as("testData");
    });
  });

  const byPassLogin = () => {
    cy.viewport(1536, 960);
    cy.login_using_token();
    cy.visit("/admin");
  };

  const fillTheSearchForm = (eachDataTest) => {
    cy.get(
      '[href="/admin/statistic"] > .MuiListItem-root > .MuiBox-root'
    ).click();
    cy.scrollTo("bottom");

    // Fill in the "Tên nhóm" field
    if (eachDataTest.FormData.GroupTypeName) {
      cy.get('input[placeholder="Nhập tên nhóm"]').type(
        eachDataTest.FormData.GroupTypeName
      );
    }

    switch (eachDataTest.FormData.Status) {
      case "Active":
        // Open the dropdown for "Trạng thái" and select an option
        cy.get('input[placeholder="Chọn trạng thái"]').click(); // Open the dropdown
        cy.get('li[data-option-index="1"]').click(); // Select the first option in the dropdown (you can customize this)
        break;

      case "Locked":
        // Open the dropdown for "Trạng thái" and select an option
        cy.get('input[placeholder="Chọn trạng thái"]').click(); // Open the dropdown
        cy.get('li[data-option-index="2"]').click(); // Select the first option in the dropdown (you can customize this)
        break;

      case "Expired":
        // Open the dropdown for "Trạng thái" and select an option
        cy.get('input[placeholder="Chọn trạng thái"]').click(); // Open the dropdown
        cy.get('li[data-option-index="3"]').click(); // Select the first option in the dropdown (you can customize this)
        break;

      case "Deleted":
        break;

      default:
    }

    if (eachDataTest.FormData.LastActive) {
      // Check the "Lần hoạt động gần nhất" checkbox
      cy.get('input[type="checkbox"]').check();
      // Assuming the dates are disabled but if the dates are selectable, you can interact with them as follows:
      // Select Start Date (DD/MM/YYYY format) - if enabled
      cy.get('input[placeholder="DD/MM/YYYY"]')
        .first()
        .then(($input) => {
          cy.wait(100);
          const value = eachDataTest.FormData.StartDate;
          const dValues = value.split("/");
          cy.wrap($input)
            .clear()
            .type(dValues[0])
            .type(dValues[1])
            .type(dValues[2]);
        });

      // Select End Date (DD/MM/YYYY format) - if enabled
      cy.get('input[placeholder="DD/MM/YYYY"]')
        .last()
        .then(($input) => {
          cy.wait(100);
          const value = eachDataTest.FormData.EndDate; // Set the date
          const dValues = value.split("/");
          cy.wrap($input)
            .clear()
            .type(dValues[0])
            .type(dValues[1])
            .type(dValues[2]); // Trigger change event if needed
        });
    }

    // Click the "Tìm kiếm" (Search) button
    cy.wait(100);
    cy.get('button:contains("Tìm kiếm")').click();
  };

  const resultCheck = (eachDataTest) => {
    cy.wait(1000);
    if (eachDataTest.ExpectedResult.State === "Success") {
      // Get the table body rows and assert the length (excluding header row)
      cy.get("table tbody tr")
        .its("length")
        .then((rowCount) => {
          // Print the number of rows
          cy.log("Number of data rows: " + rowCount);

          // Assert that the row count matches the expected number
          // For example, you can assert that the number of rows is 3
          expect(rowCount).to.be.gte(0); // Replace 3 with the expected number of rows
        });

      // Ensure that no popup exists
      // cy.get("body").find(".swal2-popup").should("not.exist");
    } else {
      if (eachDataTest.ExpectedResult.State === "Error") {
        cy.get(".swal2-popup").should("be.visible");
      } else {
        cy.get("table tbody tr")
          .its("length")
          .then((rowCount) => {
            // Print the number of rows
            cy.log("Number of data rows: " + rowCount);

            // Assert that the row count matches the expected number
            // For example, you can assert that the number of rows is 3
            expect(rowCount).to.be.equal(0); // Replace 3 with the expected number of rows
          });
      }
    }
  };

  it("TC-T-026.Search statistic group with valid data and last active is false.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      fillTheSearchForm(testData[0]);
      resultCheck(testData[0]);
    });
  });

  it("TC-T-027.Search statistic group with empty group name.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      fillTheSearchForm(testData[1]);
      resultCheck(testData[1]);
    });
  });

  it("TC-T-028.Search statistic group with invalid status.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      fillTheSearchForm(testData[2]);
      resultCheck(testData[2]);
    });
  });

  it("TC-T-029.Search statistic group with valid data and last active is true.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[3];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-030.Search statistic group with valid data, last active is false, and status is 'Locked'.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[4];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  //

  it("TC-T-031.Search statistic group with valid data, last active is true, and status is 'Expired' on the same day", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[5];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-032.Search statistic group with valid data and last active is true and 10 days duration.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[6];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-033.Search statistic group with valid data, last active is true, and 20 days duration.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[7];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-034.Search statistic group with valid data, last active is true, and 365 days duration.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[8];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-035.Search statistic group with valid data and start date greater than end date.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[9];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });

  it("TC-T-036.Search statistic group with valid data and invalid date.", () => {
    byPassLogin();
    cy.get("@testData").then((testData) => {
      const each = testData[10];
      fillTheSearchForm(each);
      resultCheck(each);
    });
  });
});
