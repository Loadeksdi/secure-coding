# Questions

# Question 1 - Why should you reset the database before each test case? Give examples of issues you may meet otherwise.
Before each test case, it is mandatory to reset the entries in the user table. If we do not reset it, there will be a dependency between each test case and when can encounter some side-effects issues. For example, to test a user creation, if we then try to retrieve the user by its id, we will only able to retrieve the user once because on the next test case, we will be fetching the previous created user.