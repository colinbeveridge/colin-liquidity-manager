package org.mfi

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/orders")
class OrderController(
    private val orderRepository: OrderRepository,
) {
    @GetMapping
    fun getHistoricalOrders(): ResponseEntity<List<Order>> {
        val orders = orderRepository.findAll()
        return ResponseEntity(orders, HttpStatus.OK)
    }

    @PostMapping
    fun order(@RequestBody order: Order): ResponseEntity<Unit> {
        orderRepository.create(order)
        return ResponseEntity(HttpStatus.OK)
    }
}