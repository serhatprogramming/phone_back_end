const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

app.use(express.static("build"));

require("dotenv").config();

app.use(morgan("tiny"));

morgan.token("body", (req) => JSON.stringify(req.body));

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const message = `
  <p>Phonebook has info for ${persons.length} people</p> 
  <p>${new Date()}</p>
  `;
  res.send(message);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (person) {
    res.json(person).end();
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (person) {
    persons = persons.filter((person) => person.id !== Number(req.params.id));
    res.status(200).json(person).end();
  } else {
    res.status(200).json({ message: "no such person" }).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.post("/api/persons", morgan(" :body"), (req, res) => {
  let person = req.body;

  if (person.name && person.number) {
    if (persons.find((p) => p.name === person.name)) {
      res.status(400).json({ error: "no duplicate names" }).end();
    } else {
      person = {
        ...person,
        id: generateId(),
      };
      persons = persons.concat(person);
      res.status(200).json(person).end();
    }
  } else {
    res
      .status(400)
      .json({ error: "add a name and a number to the contact" })
      .end();
  }
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PORT = process.env.PORT || 3001;
console.log(PORT);
app.listen(PORT, console.log(`The server is listening on PORT ${PORT}`));
