import web from "./app/web";
// import express from "express";
// const web = express();

const PORT = process.env.PORT || 3000;
web.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
