const { createServer } = require('http');
const next = require('next');
const port = process.env.PORT || 8080;

// Create the next application,
// sets up nextJS and tells it to use the routing stuff.
const app = next({
    // dev flag that specifies if we run in production / development mode
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

// Set up the app and tell it to listen to a specific port
app.prepare().then(() => {
    createServer(handler).listen(port, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:' + port);
    });
});