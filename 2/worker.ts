import { ensureQueue } from "../common";

async function main() {
  const queue = "task_queue";
  const { channel } = await ensureQueue(queue);

  // to Fair dispatch
  channel.prefetch(1);
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

  channel.consume(
    queue,
    (msg) => {
      if (!msg) return;
      const { content } = msg;
      const secs = content.toString().split(".").length - 1;

      console.log(` [x] Received ${content}`);
      setTimeout(() => {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    },
    {
      // automatic acknowledgment mode,
      // see ../confirms.html for details
      noAck: true,
    }
  );
}

main();
