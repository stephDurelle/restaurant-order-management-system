
import './App.css';
import StatCard from './components/StatCard';
import RecentOrders from './components/RecentOrders';
import { useState, useEffect } from 'react';
import { getAllOrders } from './services/orderService';

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Unable to load orders. Please check the backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    order => order.status === 'Pending'
  ).length;

  const completedOrders = orders.filter(
    order => order.status === 'Completed'
  ).length;

  const cancelledOrders = orders.filter(
    order => order.status === 'Cancelled'
  ).length;

  const totalRevenue = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + Number(order.total), 0);

  const averageOrderValue = orders.length > 0
    ? orders.reduce((sum, order) => sum + Number(order.total), 0) / orders.length
    : 0;

  return (
    <div className="app">

      <header className="header">
        <h1>Restaurant Manager</h1>
        <p>Order Management System</p>
      </header>

      <main className="dashboard">

        <section className="welcome">
          <h2>Dashboard</h2>
          <p>Welcome to your restaurant management dashboard</p>
        </section>

        {loading && <p>Loading orders...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            <section className="stats">
              <StatCard title="Total Orders" value={totalOrders} type="total" />
              <StatCard title="Pending Orders" value={pendingOrders} type="pending" />
              <StatCard title="Completed Orders" value={completedOrders} type="completed" />
              <StatCard title="Cancelled Orders" value={cancelledOrders} type="cancelled" />

              <StatCard
                title="Total Revenue"
                value={`${totalRevenue.toFixed(2)}$`}
                type="Revenu"
              />

              <StatCard
                title="Average Order Value"
                value={`${averageOrderValue.toFixed(2)}$`}
                type="average"
              />
            </section>

            <RecentOrders orders={orders} setOrders={setOrders} />
          </>
        )}

      </main>
    </div>
  );
}

export default App;
