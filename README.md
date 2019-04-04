# kermit-tests

Run ./test.sh to execute tests
If we have to run test suite multiple times. We need to update the projects API field values mentioned in testParams.env file. Since we dont have delete route for project, it will try to re-create project with same values and fails.

To run *pipelineSources* test suite, we need to add these ENV's with the specific values
GH_PROJECT_NAME -> Github repo name
GH_PROJECT_BRANCH -> Github repo branch name that have proper yml to create pipeline 
GH_USERNAME -> Github username and
GH_ACCESS_TOKEN -> github token in any of there file
