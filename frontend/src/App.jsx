import './App.css'
import StatCard from './components/StatCard'
import RecentOrders from './components/RecentOrders'

function App(){

  return(
    //className me permet ici d'attribuer une classe CSS à un élément HTML
    //header = entête. main= le corps principal
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
          <StatCard title="Total Orders" value={0}/>
          <StatCard title="Pending Orders" value={0}/>
          <StatCard title="Completed Orders" value={0}/>
          <StatCard title="Cancelled Orders" value={0}/>
        </section>

        <RecentOrders/>
      </main>




    </div>
  )
} export default App