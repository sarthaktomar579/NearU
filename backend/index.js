import app from "./src/server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server is running locally on port ${PORT}`);
});
