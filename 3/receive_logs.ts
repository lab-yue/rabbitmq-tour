import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "logs";

  await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });

  const q = await channel.assertQueue("", {
    exclusive: true,
  });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
  channel.bindQueue(q.queue, exchange, "");

  channel.consume(
    q.queue,
    (msg) => {
      if (!msg) return;
      if (msg.content) {
        console.log(" [x] %s", msg.content.toString());
      }
    },
    { noAck: true }
  );
}

main();
