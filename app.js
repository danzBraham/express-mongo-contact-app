import express from "express";
import expressLayouts from "express-ejs-layouts";
import "./utils/db.js";
import { Contact } from "./model/contact.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

const app = express();
const port = 3000;

// Using EJS
app.set("view engine", "ejs");

// Third party middleware
app.use(expressLayouts);
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 },
  })
);
app.use(flash());

// Built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout.ejs",
    title: "Contact List",
    contacts,
    msg: req.flash("info"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add Contact",
    contact: req.body,
  });
});

app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    layout: "layouts/main-layout.ejs",
    title: "Contact Details",
    contact,
  });
});

app.delete("/contact/:name", async (req, res) => {
  await Contact.deleteOne({ name: req.params.name });
  res.redirect("/contact");
});

app.use("/", (req, res) => {
  res.status(404).send(`<h1>404 Not Found</h1>`);
});

app.listen(port, () => {
  console.log(`Express Mongo Contact App | Server listening on port ${port}`);
});
