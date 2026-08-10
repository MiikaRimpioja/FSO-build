const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const server = http.createServer(app);
dotenv.config();
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Custom morgan token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Middlewaret
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.static("dist"));

// Endpoints
app.get("/", (req, res) => {
  res.send("<h1>Tervetuloa sovelluksen juureen!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).send("Person not found");
    }
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.countDocuments().then((count) => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const person = persons.find((p) => p.id === id);

    if (!person) {
      return res.status(404).send("Person not found");
    }

    persons.splice(persons.indexOf(person), 1);
    res.status(204).end();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const name = body.name;
  const number = body.number;

  if (!name || !number) {
    return res.status(400).send("Name and number are required");
  }
  if (persons.some((person) => person.name === name)) {
    return res.status(400).send("Name must be unique");
  }

  const newPerson = {
    name,
    number,
  };

  Person.create(newPerson)
    .then((savedPerson) => {
      res.status(201).json(savedPerson);
    })
    .catch((error) => {
      res.status(500).send("Internal Server Error");
    });
});
