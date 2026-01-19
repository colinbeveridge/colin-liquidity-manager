package org.mfi

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["org.mfi"])
open class LiquidityManagerApi {
    private val log = KotlinLogging.logger {}
}

fun main(args: Array<String>) {
    runApplication<LiquidityManagerApi>(*args)
}