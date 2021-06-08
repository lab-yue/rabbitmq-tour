import { ensureQueue } from "../common";

async function main() {
  const queue = "hello";
  const { channel } = await ensureQueue(queue);

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
  channel.consume(
    queue,
    (msg) => {
      console.log(`[x] Received ${msg?.content}`);
    },
    {
      noAck: true,
    }
  );
}

main();
