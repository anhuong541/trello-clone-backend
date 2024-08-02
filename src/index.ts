const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const port = 3456;

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  methods: "GET,POST,PUT,DELETE",
  //   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", async (req: Request, res: Response) => {
  console.log("it runn!!!!");
  res.json();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
