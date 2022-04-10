const express = require("express");
const fetch = require("node-fetch");
const { graphqlHTTP } = require("express-graphql");
const { loadSchemaSync } = require("@graphql-tools/load");
const { addResolversToSchema } = require("@graphql-tools/schema");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

const app = express();

const schema = loadSchemaSync("./schema/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const resolveFilms = (parent) => {
  const promises = parent.films.map(async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  return Promise.all(promises);
};

const resolvers = {
  Planet: {
    films: resolveFilms,
  },
  Person: {
    homeworld: async (parent) => {
      const response = await fetch(parent.homeworld);
      return response.json();
    },
    films: resolveFilms,
  },
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    getPerson: async (_, { id }) => {
      const response = await fetch(`https://swapi.dev/api/people/${id}/`);
      return response.json();
    },
  },
};

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

app.use(
  graphqlHTTP({
    schema: schemaWithResolvers,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server is running"));
