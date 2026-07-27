const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const server = http.createServer(app);

dotenv.config();
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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send("Person not found");
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`,
  );
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
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).send("Name and number are required");
  }
  if (persons.some((person) => person.name === name)) {
    return res.status(400).send("Name must be unique");
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number,
  };

  persons.push(newPerson);
  res.status(201).json(newPerson);
});

// Sample data
const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "040-789012",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-345678",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "040-901234",
  },
];
