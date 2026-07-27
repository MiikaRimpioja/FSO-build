import { useState, useEffect } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new person</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        setNotificationMessage={setNotificationMessage}
        setNotificationType={setNotificationType}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={filter}
        setPersons={setPersons}
        setNotificationMessage={setNotificationMessage}
        setNotificationType={setNotificationType}
      />
    </div>
  );
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      <p>filter shown with</p>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  persons,
  setPersons,
  setNotificationMessage,
  setNotificationType,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const existing = persons.find((person) => person.name === newName);

        if (existing) {
          if (
            window.confirm(
              `${existing.name} is already added to phonebook, replace the old number with a new one?`,
            )
          ) {
            const updatedPerson = { ...existing, number: newNumber };

            personService
              .updatePerson(existing.id, updatedPerson)
              .then((returnedPerson) => {
                setPersons((prev) =>
                  prev.map((p) =>
                    p.id !== returnedPerson.id ? p : returnedPerson,
                  ),
                );
                setNotificationMessage(`Updated ${existing.name}'s number`);
                setNotificationType("success");
                setTimeout(() => {
                  setNotificationMessage(null);
                  setNotificationType(null);
                }, 5000);
              })
              .catch((err) => {
                console.error(err);
                setNotificationMessage(
                  `Information of ${existing.name} has already been removed from server`,
                );
                setNotificationType("error");
                setTimeout(() => {
                  setNotificationMessage(null);
                  setNotificationType(null);
                }, 5000);
                setPersons((prev) => prev.filter((p) => p.id !== existing.id));
              });

            setNewName("");
            setNewNumber("");
            return;
          }
        }

        const newPerson = {
          name: newName,
          number: newNumber,
        };

        personService.addPerson(newPerson).then((returnedPerson) => {
          setPersons((prev) => prev.concat(returnedPerson));
        });
        setNotificationMessage(`Added ${newPerson.name}`);
        setNotificationType("success");
        setTimeout(() => {
          setNotificationMessage(null);
          setNotificationType(null);
        }, 5000);
        setNewName("");
        setNewNumber("");
      }}
    >
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({
  persons,
  filter,
  setPersons,
  setNotificationMessage,
  setNotificationType,
}) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
            <button
              onClick={() => {
                if (window.confirm(`Delete ${person.name}?`)) {
                  personService
                    .deletePerson(person.id)
                    .then(() => {
                      setPersons(persons.filter((p) => p.id !== person.id));
                    })
                    .catch((err) => {
                      console.error(err);
                      setNotificationMessage(
                        `Information of ${person.name} has already been removed from server`,
                      );
                      setNotificationType("error");
                      setTimeout(() => {
                        setNotificationMessage(null);
                        setNotificationType(null);
                      }, 5000);
                    });
                  setNotificationMessage(`Deleted ${person.name}`);
                  setNotificationType("success");
                  setTimeout(() => {
                    setNotificationMessage(null);
                    setNotificationType(null);
                  }, 5000);
                }
              }}
            >
              delete
            </button>
          </li>
        ))}
    </ul>
  );
};

export default App;
