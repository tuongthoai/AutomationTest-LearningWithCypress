import json

# Read the JSON file
with open('D:\\HCMUS\\SoftwareTesting\\ExcercieseWorkDocuments\\BTCN04\\auto-testing\\cypress\\data\\search_group_in_statistic_data.json', 'r', encoding='utf-8') as file:
    try:
        # Load the JSON data
        test_cases = json.load(file)

        # Iterate through the array of test cases and concatenate TestCaseID and Purpose
        for test_case in test_cases:
            concatenated_string = f"{test_case['TestCaseID']}.{test_case['Purpose']}"
            print(concatenated_string)

    except json.JSONDecodeError as e:
        print(f"Error reading JSON data: {e}")
