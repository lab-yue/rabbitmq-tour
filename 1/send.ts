import { ensureQueue } from "../common";

async function main() {
  const queue = "hello";
  const msg = "Hello world";
  const { connection, channel } = await ensureQueue(queue);

  channel.sendToQueue(queue, Buffer.from(msg));

  setTimeout(async () => {
    await connection.close();
    process.exit();
  }, 500);
}

main();
