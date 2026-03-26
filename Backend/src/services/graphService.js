const buildGraph = async (db) => {
  const nodes = [];
  const edges = [];

  const orders = await db.collection("orders").find().limit(50).toArray();
  const deliveries = await db.collection("deliveries").find().toArray();
  const invoices = await db.collection("invoices").find().toArray();
  const payments = await db.collection("payments").find().toArray();
  const customers = await db.collection("customers").find().toArray();

  // 🟢 Customers
  customers.forEach(c => {
    nodes.push({
      id: "customer_" + c.businessPartner,
      type: "customer",
      data: c
    });
  });

  // 🟢 Orders
  orders.forEach(o => {
    nodes.push({
      id: "order_" + o.salesOrder,
      type: "order",
      data: o
    });

    edges.push({
      source: "customer_" + o.soldToParty,
      target: "order_" + o.salesOrder,
      label: "PLACED"
    });
  });

  // 🟡 Deliveries
  deliveries.forEach(d => {
    nodes.push({
      id: "delivery_" + d.deliveryDocument,
      type: "delivery",
      data: d
    });

    edges.push({
      source: "order_" + d.referenceSDDocument,
      target: "delivery_" + d.deliveryDocument,
      label: "DELIVERED"
    });
  });

  // 🔵 Invoices
  invoices.forEach(i => {
    nodes.push({
      id: "invoice_" + i.billingDocument,
      type: "invoice",
      data: i
    });

    edges.push({
      source: "delivery_" + i.referenceSDDocument,
      target: "invoice_" + i.billingDocument,
      label: "BILLED"
    });
  });

  // 🔴 Payments
  payments.forEach(p => {
    nodes.push({
      id: "payment_" + p.accountingDocument,
      type: "payment",
      data: p
    });

    edges.push({
      source: "invoice_" + p.referenceDocument,
      target: "payment_" + p.accountingDocument,
      label: "PAID"
    });
  });

  return { nodes, edges };
};

module.exports = { buildGraph };