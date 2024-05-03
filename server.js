const mongoose = require("mongoose");
const app = require("./app");
// const DB_HOST =
//   "mongodb+srv://Artem:aJfvNn5qUFyBGLPI@cluster0.z4pjdre.mongodb.net/db-contactbook";
const { DB_HOST, PORT = 3000 } = process.env;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful", "PORT:", PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1); // закрывает запущенные программы
  });
