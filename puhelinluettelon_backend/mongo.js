const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const nimi = process.argv[3];
const numero = process.argv[4];

const url = `mongodb+srv://rimpiojamiika_db_user:${password}@cluster0.2lf4yqs.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Note = mongoose.model("Person", noteSchema);
const person = new Note({
  name: nimi,
  number: numero,
});

if (process.argv.length === 3) {
  console.log("Phonebook:");
  Note.find().then((result) => {
    result.forEach((note) => {
      console.log(`${note.name} ${note.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const note = new Note({
    name: nimi,
    number: numero,
  });

  note.save().then(() => {
    console.log(`Added ${nimi} number ${numero} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Invalid number of arguments:", process.argv.length);
}
