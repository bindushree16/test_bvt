# kermit-tests

Run ./test.sh to execute tests
If we have to run test suite multiple times. We need to update the projects API field values mentioned in testParams.env file. Since we dont have delete route for project, it will try to re-create project with same values and fails. 