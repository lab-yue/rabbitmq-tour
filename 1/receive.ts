import amqp from "amqplib";

async function main() {
  const queue = "hello";
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: false,
  });

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
