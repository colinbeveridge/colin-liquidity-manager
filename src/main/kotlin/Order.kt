package org.mfi

import java.time.Instant

data class Order(
    val amount: Double? = null,
    val term: String? = null,
    val time: Instant? = null
)
