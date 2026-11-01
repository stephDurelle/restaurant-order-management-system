import './App.css'

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
          <div className='stat-card'>
          <h3>Total Orders</h3>
          <p>0</p>

          <div className='stat-card'>
            <h3>Pending Orders</h3>
            <p>0</p>
          </div>
          <div>
            <h3>Completed Orders</h3>
            <p>0</p>
          </div>
          </div>

          <section className='orders'>
            <h2>Recent Orders</h2>
            <p>No orders available yet</p>

          </section>
        </section>
      </main>




    </div>
  )
} export default App