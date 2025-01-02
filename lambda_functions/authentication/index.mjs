import AWS from "aws-sdk";
const bcrypt = await import("bcryptjs");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";
// Signup Function
export const handler = async (event) => {
  // const data = JSON.parse(event.body);
  // console.log(JSON.stringify(event.body));
  const { action, username, password } = event.body;
  if (action === "signup") {
    return await signup(username, password);
  } else if (action === "login") {
    return await login(username, password);
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid action" }),
  };
};

async function signup(username, password) {
  // Check if user already exists
  const existingUser = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { username },
    })
    .promise();

  if (existingUser.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Username already exists" }),
    };
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save the new user to DynamoDB
  await dynamoDB
    .put({
      TableName: TABLE_NAME,
      Item: { username, password: hashedPassword },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Signup successful" }),
  };
}

async function login(username, password) {
  // Fetch user from DynamoDB
  const user = await dynamoDB
    .get({
      TableName: TABLE_NAME,
      Key: { username },
    })
    .promise();

  if (!user.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid username or password" }),
    };
  }

  // Compare the password
  const isPasswordValid = bcrypt.compareSync(password, user.Item.password);

  if (!isPasswordValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid username or password" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Login successful", username }),
  };
}
// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return response;
// };
