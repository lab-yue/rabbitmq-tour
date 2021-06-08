import amqp from "amqplib";

export async function ensureQueue<Q extends string>(queue: Q) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: false,
  });

  return {
    name: queue,
    connection,
    channel,
  };
}
