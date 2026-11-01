 import { useState } from "react"
 
      
function RecentOrders({orders, setOrders}){

    /*const [orders, setOrders]= useState ( [{
            id:1,
            customer:'Sarah',
            items: 2,
            total: 25.00,
    status: 'Pending'
  },
  {
    id: 2,
    customer: 'Michael',
    items: 3,
    total: 42.50,
    status: 'Preparing'
  },{
    id: 3,
    customer: 'Jessica',
    items: 1,
    total: 18.00,
    status: 'Completed'
  },
  {
    id: 4,
    customer: 'David',
    items: 4,
    total: 56.00,
    status: 'Cancelled'
  
        }])*/

        const [customer, setCustomer]= useState('')
        const [items, setItems]= useState(1)
        const[total,setTotal]= useState('')
        //fonction pour ajouter une commande
        function handleSubmit(event) {
            event.preventDefault()
            if(customer.trim() ==='' || !Number.isInteger(Number(items))|| Number(items)< 1|| total ===''|| !Number.isFinite(Number(total))|| Number(total)<0){
                alert("please enter valid order information")
                return
            }
            const newOrder={
                id:Math.max(0, ...orders.map(order => order.id)) + 1,
             customer: customer.trim(),
            items: Number(items),
            total: Number(total),
            status: 'Pending'
            }
            setOrders(currentOrders=> [...currentOrders,newOrder])
            // je reinitialise le formulaire
            setCustomer('')
            setItems(1)
            setTotal('')
        }
        //fonction pour modifier le statut de la commande
        function handleStatusChange(orderId, newStatus){
            setOrders(currentOrders => currentOrders.map(order=> order.id === orderId ?{ ...order,status: newStatus}: order))
        }

    return(
        <section className="orders">
      <h2>Recent Orders</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input 
        type="text"
        placeholder="Enter Customer name"
        value={customer}
        onChange={(event)=> setCustomer(event.target.value)} />

        <label>Number of Items</label>
        <input type="number"
        min={1}
        step={1}
        value={items}
        onChange={(event)=> setItems(event.target.value   )} />
        <label>Order Total ($)</label>
        <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter order total"
        value={total}
        onChange={(event) => setTotal(event.target.value)}
/>

        <button type="submit">Add Order</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
         <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.items}</td>
              <td>{order.total.toFixed(2)}$</td>
              <td>
                <select value={order.status} 
                onChange={(event)=> handleStatusChange(order.id, event.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    )
}export default RecentOrders 
 //La methode manuelle, mais n'est pas applicablr si tu recois 200 commandes et mettre a jour la plate forme
       /* <section className="orders">
            <h2>Recent Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#001</td>
                        <td>Sarah</td>
                        <td>2</td>
                        <td>25.00$</td>
                        <td>Pending</td>
                    </tr>
                    <tr>
                        <td>#002</td>
                        <td>Michael</td>
                       <td>3</td>
                    <td>42.50$</td>
                    <td>Preparing</td>
                    </tr>

                    <tr>
                 <td>#003</td>
                <td>Jessica</td>
                <td>1</td>
                <td>$18.00</td>
                <td>Completed</td>
                </tr>
                </tbody>
            </table>


        </section>*/
