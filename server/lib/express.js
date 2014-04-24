var express = require('express'),
	app = express(),
	path = require('path'),
	port = 5556;

app.use(express.static(path.join(__dirname, '../../build')));
app.get("/", function(req, res) {
	res.redirect("/index.html");
});
app.listen(port);