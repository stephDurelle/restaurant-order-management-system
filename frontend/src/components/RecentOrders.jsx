function RecentOrders(){
    return(
        <section className="orders">
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


        </section>
    )
}export default RecentOrders