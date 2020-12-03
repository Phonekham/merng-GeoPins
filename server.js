const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
