const { port, node_env } = require('./src/config');
const app = require('./src/app');

app.listen(
  port,
  console.log(`Server running in ${node_env} mode at http://localhost:${port}`)
);
