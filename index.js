"use strict"

const express = require("express")
const exphbs = require("express-handlebars")
const app = express()
const multer = require("multer")
const tesseract = require("node-tesseract")

const upload = multer({ dest: "uploads/" })
const port = 3000

app.engine(".hbs", exphbs({defaultLayout: "single", extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("view engine", "hbs")

app.use(express.static("public"))
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`))
app.use("/jquery", express.static(`${__dirname}/node_modules/jquery/dist`))

app.get("/", (req, res) => res.render("index"))
app.post("/upload", upload.array("images"), (req, res) => {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  req.files.forEach((f) => {
    console.dir(f)
    tesseract.process(`${__dirname}/${f.path}`, (err, text) => {
      if (err) {
        console.error(err)
      } else {
        console.log(text)
      }
    })
  })
  res.render("index")
})

app.listen(port, () => console.log(`Listening on port ${port}`))
