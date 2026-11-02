import { useState } from "react"
 
      
function RecentOrders({orders, setOrders}){

        const [customer, setCustomer]= useState('')
        const [items, setItems]= useState(1)
        const[total,setTotal]= useState('')

        const[errors,setErrors]= useState({})
        const[successMessage, setSuccessMessage]=useState('')

        //rechercher et filtrer les commandes
        const [searchTerm, setSearchTerm] = useState('')
        const[statusFilter, setStatusFilter]= useState('All')

        //fonction pour ajouter une commande
        function handleSubmit(event) {
            event.preventDefault()
            const newErrors={}
            //Validation du nom du client
            if (customer.trim()=== ''){
              newErrors.customer= 'Customer name is required'
            }
            //validation du nombre d'articles
            if(!Number.isInteger(Number(items))|| Number(items)<1){newErrors.items='Enter a valid number of items'}
            //Validation du montant
            if(
              total===''||!Number.isFinite(Number(total)) || Number(total)<0
            ){ newErrors.total='Enter a valid order total'}
            setErrors(newErrors)
            setSuccessMessage('')
            //s'il existe des erreurs, on arrete la soumission
            if(Object.keys(newErrors).length>0){
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
            setErrors({})
            //Message de succes
            setSuccessMessage('Order successfully added!')
        }
        //fonction pour modifier le statut de la commande
        function handleStatusChange(orderId, newStatus){
            setOrders(currentOrders => currentOrders.map(order=> order.id === orderId ?{ ...order,status: newStatus}: order))
        }
        function handleDeleteOrder(orderId){
          setOrders(currentOrders=> currentOrders.filter(order=> order.id !== orderId ))
        }
        //le filtrage
        const filteredOrders= orders.filter(order=>{
          const matchesSearch= order.customer
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

          const matchesStatus= statusFilter === 'All' || order.status === statusFilter
          return matchesSearch && matchesStatus
        })

    return(
        <section className="orders">
      <h2>Recent Orders</h2>
{/**noValidate ? */}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="customer">Customer Name</label>
        <input 
        id="customer"
        type="text"
        placeholder="Enter Customer name"
        value={customer}
        required
        className={errors.customer ? 'input-error' : ''}
        onChange={(event)=> {setCustomer(event.target.value)
          setErrors(current=> ({...current,customer: ''}))
        } }/>
          {errors.customer&&( 
            <p className="error-message">{errors.customer}</p>
          )}

        <label htmlFor="items">Number of Items</label>
        <input 
        id="items"
        type="number"
        min={1}
        step={1}
        value={items}
        required
        className={errors.items ? 'input-error': ''}

        onChange={(event)=> {setItems(event.target.value)
          setErrors(current=>({ ...current, items: ''}))
        }} />
        {errors.items&&(
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
        className={errors.total ? 'input-error': ''}
        onChange={(event) => {setTotal(event.target.value)
          setErrors(current=> ({ ...current, total: ''}))
        }}
/>
{errors.total &&(
  <p className="error-message" > {errors.total}</p>
)}
        <button type="submit">Add Order</button>
        {
          successMessage && (
            <p className="success-message" role="status"> {successMessage}</p>
          )
        }
      </form>
       {/**Champ de recherche */}
        <div className="order-filters">
          <input type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(event)=> setSearchTerm(event.target.value)} />
          <select value={statusFilter} onChange={(event)=> setStatusFilter(event.target.value)}>
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>


          </select>
        </div>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        
         <tbody>
          {filteredOrders.map((order) => (
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
              <td>
                <button type="button" onClick={()=> handleDeleteOrder (order.id)}>
                    Delete 
                </button>
              </td>
            </tr>
          )
          )}
           {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="6"> No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
    )
}
export default RecentOrders 
 