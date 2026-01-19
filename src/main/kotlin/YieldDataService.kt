package org.mfi

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Service
import java.net.URI
import java.net.URL
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

@Service
class YieldDataService {
    fun getYields(): YieldCurve {
        val csvString = fetchLatestYieldsCSV()
        val lines = csvString.lines()
        val maturities = lines[0].split(",").drop(1).map { it.replace("\"", "") }
        val rates = lines[1].split(",").drop(1).map { it.toDouble() }
        return YieldCurve(rates = rates, maturities = maturities)
    }

    fun fetchLatestYieldsCSV(): String {
        val url = "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2026/all?type=daily_treasury_yield_curve&field_tdr_date_value=2026&page&_format=csv"
        val client = HttpClient.newHttpClient()
        val request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build()
        val response = client.send(request, HttpResponse.BodyHandlers.ofString())
        return response.body()
    }


}