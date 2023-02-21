# IAM App: database & model bootstraping (practical activity)

## Question 1 - Why should you reset the database before each test case? Give examples of issues you may meet otherwise.

Before each test case, it is mandatory to reset the entries in the user table.
If we do not reset it, there will be a dependency between each test case and
when can encounter some side-effects issues. For example, to test a user
creation, if we then try to retrieve the user by its id, we will only able to
retrieve the user once because on the next test case, we will be fetching the
previously created user.

## Question 2 - What kind of error is currently thrown in test case "should raise error if email is missing"? Is it an SQL error (occurring in the database server) or a validation error before the query got executed? What should it be, so it is easy and secure to format an error message to the end user (considering security, message internationalisation, etc.)?

In the current test case "should raise error if email is missing", an SQL error
is thrown by TypeORM. It should be a validation error making sure in advance
that the object is well-formed and that the error returned is human-readable and
does not leak any technical information about the app.

## Question 3 - Why do we need both a database constraint and a validation in typescript for the same check?

We need both a database constraint and a validation in typescript for the same
check because the database constraint is not enough to ensure that the data is
valid, and it is better to avoid creating transactions with invalid data when it
can be prevented.

## Question 4 - how models validations, such as the one you just wrote, can serve the security of your application? Give an example. In addition, which database mechanism can be leveraged for security hardening in case a validation fails (ex. while persisting 2 entities in response to the same action)? Clue: the mechanism I am thinking about could also operate on afterUpdate subscriptions.

Model validation helps to ensure that the data produced by user input is
well-formatted and follows the objects we decided to work with so we do not have
any bad surprises at runtime. An example is that an invalid email could lend to
not update a final customer or even worse if the person is malicious and decides
to try an SQL injection for example, model validations help input sanitization.
Using database constraint with the uniqueness of columns can help in case a
validation fails. Eventually, (I would personnally not recommend this one) we
can use a database trigger to rollback the transaction if a validation fails.

# IAM App: http server bootstraping (practical activity)

## Question 1: please write a small paper about that naming convention.

The REST naming convention is resource-oriented, there are multiple rules to
follow in order to respect it:

- Each resource should be identified by a unique id
- Usage of HTTP verbs to perform actions on resources (GET, POST, PUT, DELETE
  for CRUD operations)
- Usage of HTTP status codes to indicate the result of the action
- Usage of HTTP headers to indicate the format of the response

## Question 2: considering they use REST naming convention, what would do POST /web-api/users and POST /web-api/sessions endpoints?

According to the REST naming convention, POST /web-api/users would create a new
user and POST /web-api/sessions would create a new session.

## Question 4: how behaves fastify: if no json schema is provided for any of body, query and params ? if the client submits an unknown property, according to the JSON schema? if the client omits a required property, according to the JSON schema?

- If no JSON schema is provided for any of body, query and params, fastify will
  not validate the request.
- If the client submits an unknown property, fastify will silently dismiss the
  request since we have set the additionalProperties to false.
- Finally, if the client omits a required property according to the JSON schema,
  fastify will raise an error.

## Question 5: compare the stateful session persisted in a backend service with a stateless session management like JWT. Recommendation: summarise the comparison as a grid. For criteria, consider among others: the scalability, the architecture complexity, the type and quantity of information known by the client, revocation strategy, impact if a session leaks, common weaknesses due to misconfigurations, client-side strategy to protect and submit the token (or session identifier), additional library requirements, etc.

| Criteria                                         | Stateful session (backed by service)                                                               | Stateless session (JWT)                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Scalability                                      | More complex to scale                                                                              | Easy to scale                                                  |
| Architecture complexity                          | More complex (handling concurrency, session vs request range). Cannot be externalized by a service | Generally simpler (can use a SaaS)                             |
| Type and quantity of information known by client | More information is stored on server (session state)                                               | Only a token is given to the client                            |
| Revocation strategy                              | Revoking sessions on server is easier                                                              | Revocation requires additional setup (expiring date for token) |
| Impact if a session leaks                        | More information exposed                                                                           | Less information exposed                                       |
| Common weaknesses due to misconfigurations       | More potential for misconfigurations (data handling)                                               | Fewer potential misconfigurations (will work or not)           |
| Client-side strategy to protect and submit token | Not necessary, handled by server                                                                   | Mandatory                                                      |
| Additional library requirements                  | May require additional libraries for both solutions                                                |                                                                |

## Question 6: search and summarise solutions to protect the confidentiality of the session identifier stored in a browser’s cookie. Focus on the actions you can take as a backend developer or server-side infrastructure engineer.

You need to use SSL and HTTPS first, then you can use the _HttpOnly_ flag to
prevent the cookie from being accessed by JavaScript. You can also use the
_Secure_ flag to prevent the cookie from being sent over HTTP. Also, you can use
the _SameSite_ flag to prevent the cookie from being sent in cross-site
requests, and should be set to the _Strict_ value when possible. Therefore, the
browser only sends the cookie with requests from the cookie's origin site.
Finally, the domain and path attributes can be used to limit the scope of the
cookie, which is useful when dealing with session cookies. **Based on MDN
documentation: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies**

## Part 3 - Continuous Integration & Continuous Delivery

Project available at: https://secure-coding.loadeksdi.com/

- Added dependedabot for daily checks to the project will help to keep the
  dependencies up to date and avoid security issues.
- Using ESLint will help to keep the code clean and consistent.
- Building and publishing a Docker Image only in the master branch to a Docker
  Hub registry will make it available so that I can deploy it on my own server.
- Secured git repository with linear history and pull requests to commit on
  master branch. (Signed commits would be a great addition but it ended up
  pretty badly for me)

I use traefik for the reverse proxy and I can use the docker-compose file to
deploy the app on my server, including the postgresql database and the image of
my app, and a watchtower conatiner responsible for checking the image version
and auto-deploying new versions of the app.

Unfortunately, it seems complicated without setting up an in-memory database to
be able to run the postgres tests in the CI/CD pipeline.
