
package com.restaurant.backend.repository;

import com.restaurant.backend.entity.RestaurantOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<RestaurantOrder, Long> {
}
