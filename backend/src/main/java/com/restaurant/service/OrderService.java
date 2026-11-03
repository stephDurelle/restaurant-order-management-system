
package com.restaurant.backend.service;

import com.restaurant.backend.entity.RestaurantOrder;
import com.restaurant.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import com.restaurant.backend.exception.OrderNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Get all orders
    public List<RestaurantOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
  public RestaurantOrder getOrderById(Long id) {
    return orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }

    // Create a new order
    public RestaurantOrder createOrder(RestaurantOrder order) {
        order.setStatus("Pending");
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Update order status
    public RestaurantOrder updateOrderStatus(Long id, String status) {
        RestaurantOrder order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // Delete an order
    public void deleteOrder(Long id) {
        RestaurantOrder order = getOrderById(id);
        orderRepository.delete(order);
    }
}
