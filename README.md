# IAM App: database & model bootstraping (practical activity)

## Question 1 - Why should you reset the database before each test case? Give examples of issues you may meet otherwise.
Before each test case, it is mandatory to reset the entries in the user table. If we do not reset it, there will be a dependency between each test case and when can encounter some side-effects issues. For example, to test a user creation, if we then try to retrieve the user by its id, we will only able to retrieve the user once because on the next test case, we will be fetching the previously created user.

## Question 2 - What kind of error is currently thrown in test case "should raise error if email is missing"? Is it an SQL error (occurring in the database server) or a validation error before the query got executed? What should it be, so it is easy and secure to format an error message to the end user (considering security, message internationalisation, etc.)?
In the current test case "should raise error if email is missing", an SQL error is thrown by TypeORM. It should be a validation error making sure in advance that the object is well-formed and that the error returned is human-readable and does not leak any technical information about the app.

## Question 3 - Why do we need both a database constraint and a validation in typescript for the same check?
We need both a database constraint and a validation in typescript for the same check because the database constraint is not enough to ensure that the data is valid, and it is better to avoid creating transactions with invalid data when it can be prevented.

## Question 4 - how models validations, such as the one you just wrote, can serve the security of your application? Give an example. In addition, which database mechanism can be leveraged for security hardening in case a validation fails (ex. while persisting 2 entities in response to the same action)? Clue: the mechanism I am thinking about could also operate on afterUpdate subscriptions.
Model validation helps to ensure that the data produced by user input is well-formatted and follows the objects we decided to work with so we do not have any bad surprises at runtime. An example is that an invalid email could lend to not update a final customer or even worse if the person is malicious and decides to try an SQL injection for example, model validations help input sanitization. Using database constraint with the uniqueness of columns can help in case a validation fails. Eventually, (I would personnally not recommend this one) we can use a database trigger to rollback the transaction if a validation fails.  

# IAM App: http server bootstraping (practical activity)

## Question 1: please write a small paper about that naming convention.
The REST naming convention is resource-oriented, there are multiple rules to follow in order to respect it:
- Each resource should be identified by a unique id
- Usage of HTTP verbs to perform actions on resources (GET, POST, PUT, DELETE for CRUD operations)
- Usage of HTTP status codes to indicate the result of the action
- Usage of HTTP headers to indicate the format of the response

## Question 2: considering they use REST naming convention, what would do POST /web-api/users and POST /web-api/sessions endpoints?
According to the REST naming convention, POST /web-api/users would create a new user and POST /web-api/sessions would create a new session.
