
import { useState } from "react";
import {
  createOrder,
  updateOrderStatus,
  deleteOrder
} from "../services/orderService";

function RecentOrders({ orders, setOrders }) {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState(1);
  const [total, setTotal] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [selectedOrder, setSelectedOrder] = useState(null);

  // CREATE: Ajouter une commande dans PostgreSQL
  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (customer.trim() === "") {
      newErrors.customer = "Customer name is required";
    }

    if (!Number.isInteger(Number(items)) || Number(items) < 1) {
      newErrors.items = "Enter a valid number of items";
    }

    if (
      total === "" ||
      !Number.isFinite(Number(total)) ||
      Number(total) < 0
    ) {
      newErrors.total = "Enter a valid order total";
    }

    setErrors(newErrors);
    setSuccessMessage("");
    setApiError("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const newOrder = {
        customer: customer.trim(),
        items: Number(items),
        total: Number(total)
      };

      const savedOrder = await createOrder(newOrder);

      setOrders(currentOrders => [...currentOrders, savedOrder]);

      setCustomer("");
      setItems(1);
      setTotal("");
      setErrors({});
      setCurrentPage(1);

      setSuccessMessage("Order successfully added!");
    } catch (error) {
      console.error("Error creating order:", error);
      setApiError("Unable to create order. Please try again.");
    }
  }

  // UPDATE: Modifier le statut dans PostgreSQL
  async function handleStatusChange(orderId, newStatus) {
    setApiError("");
    setSuccessMessage("");

    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);

      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );

      setSelectedOrder(current =>
        current?.id === orderId ? updatedOrder : current
      );

      setSuccessMessage("Order status successfully updated!");
    } catch (error) {
      console.error("Error updating order:", error);
      setApiError("Unable to update order status. Please try again.");
    }
  }

  // DELETE: Supprimer une commande de PostgreSQL
  async function handleDeleteOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    setApiError("");
    setSuccessMessage("");

    try {
      await deleteOrder(orderId);

      setOrders(currentOrders =>
        currentOrders.filter(order => order.id !== orderId)
      );

      setSelectedOrder(current =>
        current?.id === orderId ? null : current
      );

      setSuccessMessage("Order successfully deleted!");
    } catch (error) {
      console.error("Error deleting order:", error);
      setApiError("Unable to delete order. Please try again.");
    }
  }

  // SEARCH AND FILTER
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const effectivePage = Math.min(currentPage, Math.max(totalPages, 1));

  const indexOfLastOrder = effectivePage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  return (
    <section className="orders">
      <h2>Recent Orders</h2>

      {/* CREATE ORDER FORM */}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="customer">Customer Name</label>
        <input
          id="customer"
          type="text"
          placeholder="Enter Customer name"
          value={customer}
          required
          className={errors.customer ? "input-error" : ""}
          onChange={event => {
            setCustomer(event.target.value);
            setErrors(current => ({ ...current, customer: "" }));
          }}
        />
        {errors.customer && (
          <p className="error-message">{errors.customer}</p>
        )}

        <label htmlFor="items">Number of Items</label>
        <input
          id="items"
          type="number"
          min="1"
          step="1"
          value={items}
          required
          className={errors.items ? "input-error" : ""}
          onChange={event => {
            setItems(event.target.value);
            setErrors(current => ({ ...current, items: "" }));
          }}
        />
        {errors.items && (
          <p className="error-message">{errors.items}</p>
        )}

        <label htmlFor="total">Order Total ($)</label>
        <input
          id="total"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter order total"
          value={total}
          required
          className={errors.total ? "input-error" : ""}
          onChange={event => {
            setTotal(event.target.value);
            setErrors(current => ({ ...current, total: "" }));
          }}
        />
        {errors.total && (
          <p className="error-message">{errors.total}</p>
        )}

        <button type="submit">Add Order</button>

        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}

        {apiError && (
          <p className="error-message" role="alert">
            {apiError}
          </p>
        )}
      </form>

      {/* SEARCH AND FILTER */}
      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={event => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={statusFilter}
          onChange={event => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.items}</td>
              <td>{Number(order.total).toFixed(2)}$</td>
              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </td>

              <td>
                <select
                  value={order.status}
                  onChange={event =>
                    handleStatusChange(order.id, event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>

              <td>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="7">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ORDER DETAILS */}
      {selectedOrder && (
        <div className="order-details">
          <h3>Order Details</h3>

          <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
          <p><strong>Customer:</strong> {selectedOrder.customer}</p>
          <p><strong>Items:</strong> {selectedOrder.items}</p>
          <p>
            <strong>Total:</strong>{" "}
            {Number(selectedOrder.total).toFixed(2)}$
          </p>
          <p>
            <strong>Date Created:</strong>{" "}
            {selectedOrder.createdAt
              ? new Date(selectedOrder.createdAt).toLocaleString()
              : "N/A"}
          </p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>

          <button
            type="button"
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          type="button"
          disabled={effectivePage === 1}
          onClick={() => setCurrentPage(effectivePage - 1)}
        >
          Previous
        </button>

        <span>
          Page {effectivePage} of {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          disabled={effectivePage >= totalPages}
          onClick={() => setCurrentPage(effectivePage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default RecentOrders;
