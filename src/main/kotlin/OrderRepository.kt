package org.mfi

import jakarta.annotation.PostConstruct
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
open class OrderRepository(
    val jdbc: JdbcTemplate
) {
    private val rowMapper = RowMapper { rs, _ ->
        Order(
            amount = rs.getDouble("amount"),
            term = rs.getString("term"),
            time = Instant.parse(rs.getString("created_at"))
        )
    }

    /**
     * Insert a new order and return the created row
     */
    open fun create(order: Order) {
        println("Updating with Order: $order")
        jdbc.update(
            """
            INSERT INTO orders (amount, term, created_at)
            VALUES (?, ?, ?)
            """.trimIndent(),
            order.amount,
            order.term,
            Instant.now().toString()
        )
    }

    /**
     * Fetch all orders
     */
    open fun findAll(): List<Order> {
        return jdbc.query(
            """
            SELECT *
            FROM orders
            ORDER BY created_at DESC
            """.trimIndent(),
            rowMapper
        )
    }

}
