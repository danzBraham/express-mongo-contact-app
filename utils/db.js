import mongoose from "mongoose";
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/myDB", { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Successfully connected to the database!");
});

// Add 1 Document
// const contact1 = new Contact({
//   name: "John Jejeng",
//   mobPhone: "08123456789",
//   email: "john@gmail.com",
// });

// Save Contact
// Way 1
// contact1
//   .save()
//   .then((contact) => console.log(contact))
//   .catch((err) => handleError(err));

// Way 2
// contact1.save((err) => {
//   if (err) return handleError(err);
// });
