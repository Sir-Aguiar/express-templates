import { HTTP_SERVER } from "./server/server";

HTTP_SERVER.listen(8080, () => {
  console.log("Server is running on port 8080")
});
