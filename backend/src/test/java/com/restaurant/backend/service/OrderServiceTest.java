
package com.restaurant.backend.service;

import com.restaurant.backend.entity.RestaurantOrder;
import com.restaurant.backend.exception.OrderNotFoundException;
import com.restaurant.backend.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private RestaurantOrder testOrder;

    @BeforeEach
    void setUp() {
        testOrder = new RestaurantOrder();
        testOrder.setCustomer("Sarah");
        testOrder.setItems(2);
        testOrder.setTotal(new BigDecimal("25.00"));
        testOrder.setStatus("Pending");
    }

    @Test
    void getAllOrdersShouldReturnAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(testOrder));

        List<RestaurantOrder> result = orderService.getAllOrders();

        assertEquals(1, result.size());
        assertEquals("Sarah", result.get(0).getCustomer());

        verify(orderRepository).findAll();
    }

    @Test
    void getOrderByIdShouldReturnOrderWhenItExists() {
    when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

    RestaurantOrder result = orderService.getOrderById(1L);

    assertNotNull(result);
    assertSame(testOrder, result);
    assertEquals("Sarah", result.getCustomer());
    }

    @Test
    void getOrderByIdShouldThrowExceptionWhenOrderDoesNotExist() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(
            OrderNotFoundException.class,
            () -> orderService.getOrderById(999L)
        );
    }

    @Test
    void createOrderShouldSetPendingStatusAndSaveOrder() {
        when(orderRepository.save(any(RestaurantOrder.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RestaurantOrder newOrder = new RestaurantOrder();
        newOrder.setCustomer("Michael");
        newOrder.setItems(3);
        newOrder.setTotal(new BigDecimal("45.00"));

        RestaurantOrder result = orderService.createOrder(newOrder);

        assertEquals("Pending", result.getStatus());
        assertNotNull(result.getCreatedAt());

        verify(orderRepository).save(newOrder);
    }

    @Test
    void updateOrderStatusShouldChangeStatus() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(testOrder)).thenReturn(testOrder);

        RestaurantOrder result =
                orderService.updateOrderStatus(1L, "Completed");

        assertEquals("Completed", result.getStatus());

        verify(orderRepository).save(testOrder);
    }

    @Test
    void deleteOrderShouldDeleteExistingOrder() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        orderService.deleteOrder(1L);

        verify(orderRepository).delete(testOrder);
    }
}
