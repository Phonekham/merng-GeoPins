const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require("./controllers/userController");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (error) {
      console.log(`Unable to authenticate ${authToken}`);
    }
    return { currentUser };
  },
});

mongoose
  .connect("mongodb://localhost:27017/merng-GeoPins", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch(() => console.log("Fail conect to DB"));

server.listen().then(({ url }) => {
  console.log(`Server listen to ${url}`);
});
