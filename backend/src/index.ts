import { buildApp } from './app.js';
import { config } from './config/env.js';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({
      port: config.PORT,
      host: config.HOST,
    });
    console.log(`🚀 VeriGig API Server listening at http://${config.HOST}:${config.PORT}`);
    console.log(`📡 Healthcheck available at http://${config.HOST}:${config.PORT}/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
