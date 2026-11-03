
package com.restaurant.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "orders")
public class RestaurantOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name is required")
@Column(nullable = false)
private String customer;

@NotNull(message = "Number of items is required")
@Min(value = 1, message = "At least one item is required")
@Column(nullable = false)
private Integer items;

@NotNull(message = "Order total is required")
@DecimalMin(value = "0.00", message = "Order total cannot be negative")
@Column(nullable = false, precision = 10, scale = 2)
private BigDecimal total;

private String status;
private LocalDateTime createdAt;

    public RestaurantOrder() {
    }

    public RestaurantOrder(
        String customer, Integer items,
                           BigDecimal total, String status,
                           LocalDateTime createdAt) {
        this.customer = customer;
        this.items = items;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public Integer getItems() {
        return items;
    }

    public void setItems(Integer items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
