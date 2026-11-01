import './App.css'
import StatCard from './components/StatCard'
import RecentOrders from './components/RecentOrders'
import { useState } from 'react'
function App(){
  // 
  const[orders,setOrders]= useState([
    {id:1, customer: 'Sarah', items:2, total: 25.00, status:'Pending'},
    {id:2, customer: 'Michael', items:3, total: 42.50, status:'Preparing'},
    {id:3, customer: 'Jessica', items:1, total: 18.00, status:'Completed'},
    {id:4, customer: 'David', items:4, total: 56.00, status:'Cancelled'}
  ])
  const totalOrders =orders.length
  const pendingOrders= orders.filter(order => order.status ==='Pending').length
  const completedOrders= orders.filter(order => order.status ==='Completed').length
  const cancelledOrders= orders.filter(order=> order.status==='Cancelled').length

  return(
    //className me permet ici d'attribuer une classe CSS à un élément HTML
    //header = entête. main= le corps principal
    //affiche les commandes recentOrders
    <div className='app'>
    
      <header className='header'>
      <h1>Restaurant Manager</h1>
      <p>Order Management System</p>
      </header>

      <main className='dashboard'>
        <section className='welcome'>
        <h2>Dashboard</h2>
        <p>Welcome to your restaurant management dashboard</p>
        </section>

        <section className='stats'> 
          <StatCard title="Total Orders" value={totalOrders} type="total"/>
          <StatCard title="Pending Orders" value={pendingOrders} type="pending"/>
          <StatCard title="Completed Orders" value={completedOrders}type="completed"/>
          <StatCard title="Cancelled Orders" value={cancelledOrders} type="cancelled"/>
        </section>

        <RecentOrders orders={orders} setOrders={setOrders}/>
      </main>




    </div>
  )
} export default App