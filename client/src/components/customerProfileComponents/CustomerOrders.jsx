import React, { useMemo, useState } from "react";

const FAKE_ORDERS = [
  {
    orderId: 2001,
    createdAt: "2025-08-10",
    status: "partially_denied", // master order status
    restaurants: [
      {
        restaurantName: "Pizza Hut",
        status: "accepted",
        items: [
          { name: "Large Pepperoni Pizza", qty: 1, price: 2500 },
          { name: "Garlic Bread", qty: 2, price: 900 },
        ],
      },
      {
        restaurantName: "KFC",
        status: "denied",
        items: [{ name: "Zinger Burger", qty: 2, price: 1600 }],
      },
    ],
  },
  {
    orderId: 2002,
    createdAt: "2025-08-05",
    status: "completed",
    restaurants: [
      {
        restaurantName: "Dominos",
        status: "delivered",
        items: [
          { name: "Cheese Pizza", qty: 1, price: 2200 },
          { name: "Coke 1L", qty: 1, price: 500 },
        ],
      },
    ],
  },
];

export default function CustomerOrdersTable() {
  const [orders] = useState(FAKE_ORDERS);

  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
      ),
    [orders]
  );

  const statusBadge = (status) => {
    const base =
      "rounded-full px-2 py-0.5 text-xs font-semibold capitalize ";
    switch (status) {
      case "cancelled":
      case "denied":
        return base + "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
      case "partially_denied":
        return base + "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100";
      case "accepted":
      case "preparing":
        return base + "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
      case "delivered":
      case "completed":
        return base + "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100";
      default:
        return base + "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      <div className="space-y-6">
        {sorted.map((order) => (
          <div
            key={order.orderId}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            {/* Master order header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Order ID: #{order.orderId}
              </span>
              <span className={statusBadge(order.status)}>{order.status}</span>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.restaurants.map((rest, idx) => (
                <div key={idx} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {rest.restaurantName}
                    </h2>
                    <span className={statusBadge(rest.status)}>
                      {rest.status}
                    </span>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Item
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {rest.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {item.qty}
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            Rs. {item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Master order footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Status:{" "}
                <span className={statusBadge(order.status)}>
                  {order.status}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
