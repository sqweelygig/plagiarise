/* tslint:disable:no-console */
import * as Express from "express";
import * as Path from "path";

const app = Express();
const port = process.env.PORT || 80;

app.get("/", (request, response) => {
	const root = Path.join(__dirname, "..", "..");
	const index = Path.join(root, "client", "distribute", "editor.html");
	response.sendFile(index);
});
app.use("/", Express.static(Path.join("client", "distribute")));

console.log("============");
app.listen(port, () => {
	console.log("Listening", port);
});
