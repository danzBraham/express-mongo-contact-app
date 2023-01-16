import express from "express";
import expressLayouts from "express-ejs-layouts";
import "./utils/db.js";
import { Contact } from "./model/contact.js";
import { body, validationResult, check } from "express-validator";
import methodOverride from "method-override";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

const app = express();
const port = 3000;

// Using EJS
app.set("view engine", "ejs");

// Third party middleware
app.use(expressLayouts);
app.use(methodOverride("_method"));
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

app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("The Name Already Exists!");
      }
      return true;
    }),
    check("email", "Invalid Email!").isEmail(),
    check("mobPhone", "Invalid Phone Number!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        layout: "layouts/main-layout.ejs",
        title: "Add Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await Contact.insertMany(req.body);
      req.flash("info", "Successfully Added Contact!");
      res.redirect("/contact");
    }
  }
);

app.delete("/contact", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.body.id });
  if (!contact) {
    res.status(400).send(`<h1>400 Bad Request</h1>`);
  } else {
    await Contact.deleteOne({ _id: req.body.id });
    req.flash("info", "Successfully Deleted Contact!");
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    layout: "layouts/main-layout.ejs",
    title: "Edit Contact",
    contact,
  });
});

app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("The Name Already Exists!");
      }
      return true;
    }),
    check("email", "Invalid Email!").isEmail(),
    check("mobPhone", "Invalid Phone Number!").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        layout: "layouts/main-layout.ejs",
        title: "Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobPhone: req.body.mobPhone,
          },
        }
      );
      req.flash("info", "Successfully Updated Contact!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    layout: "layouts/main-layout.ejs",
    title: "Contact Details",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404).send(`<h1>404 Not Found</h1>`);
});

app.listen(port, () => {
  console.log(`Express Mongo Contact App | Server listening on port ${port}`);
});
