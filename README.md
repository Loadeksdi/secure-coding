# Questions

## Question 1 - Why should you reset the database before each test case? Give examples of issues you may meet otherwise.
Before each test case, it is mandatory to reset the entries in the user table. If we do not reset it, there will be a dependency between each test case and when can encounter some side-effects issues. For example, to test a user creation, if we then try to retrieve the user by its id, we will only able to retrieve the user once because on the next test case, we will be fetching the previously created user.

## Question 2 - What kind of error is currently thrown in test case "should raise error if email is missing"? Is it an SQL error (occurring in the database server) or a validation error before the query got executed? What should it be, so it is easy and secure to format an error message to the end user (considering security, message internationalisation, etc.)?
In the current test case "should raise error if email is missing", an SQL error is thrown by TypeORM. It should be a validation error making sure in advance that the object is well-formed and that the error returned is human-readable and does not leak any technical information about the app.