package org.mfi

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["org.mfi"])
open class LiquidityManagerApi

fun main(args: Array<String>) {
    runApplication<LiquidityManagerApi>(*args)
}