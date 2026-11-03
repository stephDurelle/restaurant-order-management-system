
package com.restaurant.backend.controller;

import com.restaurant.backend.entity.RestaurantOrder;
import com.restaurant.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // GET: Retrieve all orders
    @GetMapping
    public List<RestaurantOrder> getAllOrders() {
        return orderService.getAllOrders();
    }

    // GET: Retrieve an order by ID
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantOrder> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // POST: Create a new order
   @PostMapping
public ResponseEntity<RestaurantOrder> createOrder(
        @Valid @RequestBody RestaurantOrder order) {

    RestaurantOrder savedOrder = orderService.createOrder(order);
    return ResponseEntity.ok(savedOrder);
}

    // PUT: Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<RestaurantOrder> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        List<String> allowedStatuses = List.of(
       "Pending",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled"
        );

        if (status == null || !allowedStatuses.contains(status)) {
        return ResponseEntity.badRequest().build();
        }

        RestaurantOrder updatedOrder =
                orderService.updateOrderStatus(id, status);

        return ResponseEntity.ok(updatedOrder);
    }

    // DELETE: Delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
