
package com.restaurant.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.backend.entity.RestaurantOrder;
import com.restaurant.backend.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@Import(OrderControllerTest.TestConfig.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    void getAllOrdersShouldReturnOrders() throws Exception {
        RestaurantOrder order = new RestaurantOrder();
        order.setCustomer("Sarah");
        order.setItems(2);
        order.setTotal(new BigDecimal("25.00"));
        order.setStatus("Pending");

        when(orderService.getAllOrders()).thenReturn(List.of(order));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customer").value("Sarah"));
    }

    @Test
    void createOrderShouldReturnCreatedOrder() throws Exception {
        RestaurantOrder order = new RestaurantOrder();
        order.setCustomer("Michael");
        order.setItems(3);
        order.setTotal(new BigDecimal("45.00"));

        RestaurantOrder savedOrder = new RestaurantOrder();
        savedOrder.setCustomer("Michael");
        savedOrder.setItems(3);
        savedOrder.setTotal(new BigDecimal("45.00"));
        savedOrder.setStatus("Pending");

        when(orderService.createOrder(any(RestaurantOrder.class)))
                .thenReturn(savedOrder);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customer").value("Michael"))
                .andExpect(jsonPath("$.status").value("Pending"));
    }

    @Test
    void updateOrderStatusShouldReturnUpdatedOrder() throws Exception {
        RestaurantOrder order = new RestaurantOrder();
        order.setCustomer("Sarah");
        order.setItems(2);
        order.setTotal(new BigDecimal("25.00"));
        order.setStatus("Completed");

        when(orderService.updateOrderStatus(1L, "Completed"))
                .thenReturn(order);

        mockMvc.perform(put("/api/orders/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"Completed\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Completed"));
    }

    @Test
    void updateOrderStatusShouldRejectInvalidStatus() throws Exception {
        mockMvc.perform(put("/api/orders/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"Invalid\"}"))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).updateOrderStatus(anyLong(), anyString());
    }

    @Test
    void deleteOrderShouldReturnNoContent() throws Exception {
        doNothing().when(orderService).deleteOrder(1L);

        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());

        verify(orderService).deleteOrder(1L);
    }

    @Test
    void createOrderShouldRejectInvalidData() throws Exception {
        RestaurantOrder order = new RestaurantOrder();
        order.setCustomer("");
        order.setItems(0);
        order.setTotal(new BigDecimal("-10.00"));

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).createOrder(any(RestaurantOrder.class));
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        GlobalExceptionHandler globalExceptionHandler() {
            return new GlobalExceptionHandler();
        }
    }
}
