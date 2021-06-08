import amqp from "amqplib";

const cache = new Map<number, number>([
  [0, 0],
  [1, 1],
]);

function fibonacci(n: number): number {
  const hit = cache.get(n);
  if (hit !== undefined) return hit;
  const ret = fibonacci(n - 1) + fibonacci(n - 2);
  cache.set(n, ret);
  return ret;
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "rpc_queue";

  const q = await channel.assertQueue(queue, {
    exclusive: true,
  });
  channel.prefetch(1);
  console.log(" [x] Awaiting RPC requests");

  channel.consume(q.queue, (msg) => {
    if (!msg) return;
    const n = parseInt(msg.content.toString(), 10);

    console.log(` [.] fib(${n})`);

    const r = fibonacci(n);

    channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
      correlationId: msg.properties.correlationId,
    });

    channel.ack(msg);
  });
}

main();
