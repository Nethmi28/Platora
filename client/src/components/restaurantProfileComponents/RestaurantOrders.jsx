import React, { useState } from "react";

export default function OrdersPage() {
  // Dummy orders data (replace with DB fetch later)
  const [orders] = useState([
    {
      id: 1,
      status: "pending",
      items: [
        { id: 101, name: "Chicken Fried Rice", quantity: 2, price: 450 },
        { id: 102, name: "Vegetable Noodles", quantity: 1, price: 400 },
      ],
    },
    {
      id: 2,
      status: "accepted",
      items: [
        { id: 103, name: "Mutton Curry", quantity: 1, price: 600 },
        { id: 104, name: "Paratha", quantity: 3, price: 150 },
      ],
    },
    {
      id: 3,
      status: "completed",
      items: [{ id: 105, name: "Ice Cream", quantity: 2, price: 200 }],
    },
  ]);

  const statusBadge = (status) => {
    const base = "rounded-full px-2 py-0.5 text-xs font-semibold capitalize ";
    switch (status) {
      case "accepted":
        return base + "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100";
      case "denied":
        return base + "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
      case "completed":
        return base + "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
      case "pending":
        return base + "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
      default:
        return base;
    }
  };

  return (
    <div className="p-6">
      {/* Simple Heading */}
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            {/* Order Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Order ID: #{order.id}
              </span>
              <span className={statusBadge(order.status)}>{order.status}</span>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Item</th>
                    <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-left font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        Rs. {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Status:{" "}
                <span className={statusBadge(order.status)}>{order.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
