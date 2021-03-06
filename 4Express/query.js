/*Connect the server to the IA2 repository on GraphDB*/
const { ServerClient, ServerClientConfig } = require("graphdb").server;
const {
  RepositoryClientConfig,
  GetStatementsPayload
} = require("graphdb").repository;
const { SparqlXmlResultParser } = require("graphdb").parser;
const { RDFMimeType } = require("graphdb").http;
const {
  GetQueryPayload,
  QueryType,
  QueryLanguage,
  QueryPayload
} = require("graphdb").query;
const QueryDocument = require("../models/queryDocument");
const QueryStrings = require("../models/queryStrings");
const express = require("express");
const router = express.Router();

var QueryStringsConst = new QueryStrings();
var results = [];
var hashResult = new Map();
const readTimeout = 30000;
const writeTimeout = 30000;
const config = new ServerClientConfig("http://localhost:7200/", 0, {});
const server = new ServerClient(config);
const repositoryClientConfig = new RepositoryClientConfig(
  ["http://localhost:7200/repositories/IA2Project"],
  {},
  "",
  readTimeout,
  writeTimeout
);

var rdfRepositoryClient;
server.getRepository("IA2Project", repositoryClientConfig).then(rep => {
  console.log("REPOSITORY GET");
  rdfRepositoryClient = rep;
  rdfRepositoryClient.registerParser(new SparqlXmlResultParser());
});

function createSelectQuery(query) {
  return new GetQueryPayload()
    .setQuery(query)
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_XML);
}

function clearDataStructures() {
  results = [];
  hashResult.clear();
}

var query = router.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*This function create an object of type QueryDocument using the result obtained from the SPARQL query to GraphDB*/
function createResults(bindings) {
  var t = new QueryDocument(
    bindings.book,
    bindings.title != null ? bindings.title.value.replace(new RegExp("[{,}]", "g"), "") : "",
    bindings.year != null ? bindings.year.value : "",
    bindings.name != null ? bindings.name.value.replace(",", " ") : "",
    bindings.isbn != null ? bindings.isbn.value : ""
  );
  if (hashResult.get(t.uri.id) !== undefined) {
    console.log(t.uri.id);
    hashResult.get(t.uri.id).authors = (
      hashResult.get(t.uri.id).authors +
      ", " +
      t.authors.replace(",", " ")
    )
      .replace(/{\\"u}/g, "ü")
      .replace(/\\'{e}/g, "é")
      .replace(/{\\"u}/g, "ö");
  } else {
    hashResult.set(t.uri.id, t);
  }
}

/*Use this route to search all*/
var query = router.get("/all", (req, res, next) => {
  console.log("GET ALL RECEIVED");
  console.log(req.query.year);

  clearDataStructures();

  query = QueryStringsConst.allQuery(req.query.year);

  const payload = createSelectQuery(query).setLimit(40);

  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Use this route (replacing the GET parameter with the title of the document) to search by title */
router.get("/searchByTitle/:name", (req, res, next) => {
  console.log("GET BY TITLE RECEIVED");
  console.log(req.query);

  clearDataStructures();

  var query = QueryStringsConst.searchByTitleQuery(
    req.params.name,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query);

  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Use this route (replacing the GET parameter with the ISBN of the document) to search by ISBN */
router.get("/searchByIsbn/:isbn", (req, res, next) => {
  console.log("GET BY TITLE RECEIVED");
  console.log(req.query);

  clearDataStructures();

  query = QueryStringsConst.searchByISBNQuery(
    req.params.isbn,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query);

  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});



/*Use this route (replacing the GET parameter with the name of an author) to search by author */
router.get("/searchByAuthor/:author", (req, res, next) => {
  console.log("GET BY AUTHOR RECEIVED");
  console.log(req.query);

  clearDataStructures();

  query = QueryStringsConst.searchByAuthorQuery(
    req.params.author,
    req.query.orderBy,
    req.query.year,
    req.query.type
  );

  const payload = createSelectQuery(query);

  rdfRepositoryClient.query(payload).then(stream => {
    stream.on("data", bindings => {
      console.log(bindings);
      createResults(bindings);
    });
    stream.on("end", () => {
      Array.from(hashResult.keys()).map(e => {
        results.push(hashResult.get(e));
      });
      res.status(200).json(results);
    });
  });
});


module.exports = router;
