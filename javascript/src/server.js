import 'dotenv/config';
import Logger from './config/logger';
import App from './app';

const MAX_RETRY = 20;
const LOG = new Logger('server.js');
const { PORT = 3000 } = process.env;
const db = require('./config/database');

const startApplication = async (retryCount) => {
  try {


    await db.sequelize.authenticate();
    db.sequelize.sync({force: true}).then(() => {
      console.log('Drop and Resync with { force: true }');
    });
    App.listen(PORT, () => {
      LOG.info(`Application started at http://localhost:${PORT}`);
    });

  } catch (e) {
    LOG.error(e);

    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000);
      return;
    }

    LOG.error('Unable to start application');
  }
};

startApplication(MAX_RETRY);
