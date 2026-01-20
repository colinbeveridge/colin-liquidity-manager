package org.mfi

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/yields")
class YieldController(
    val yieldService: YieldDataService
) {
    val log = KotlinLogging.logger {}
    @GetMapping
    fun getYields(): ResponseEntity<YieldCurve> {
        return ResponseEntity(yieldService.getYields(), HttpStatus.OK)
    }
}