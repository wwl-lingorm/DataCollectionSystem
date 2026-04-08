import { createApp } from "./app";
import { env } from "./shared/config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`DataCollectionSystem API running at http://localhost:${env.port}`);
});
