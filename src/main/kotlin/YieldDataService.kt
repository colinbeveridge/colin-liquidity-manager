package org.mfi

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

@Service
class YieldDataService(
    @Value("\${yield.data.url}")
    private val yieldDataUrl: String
) {
    fun getYields(): YieldCurve {
        val csvString = fetchLatestYieldsCSV()
        val lines = csvString.lines()
        val maturities = lines[0].split(",").drop(1).map { it.replace("\"", "") }
        val rates = lines[1].split(",").drop(1).map { it.toDouble() }
        return YieldCurve(rates = rates, maturities = maturities)
    }

    fun fetchLatestYieldsCSV(): String {
        val client = HttpClient.newHttpClient()
        val request = HttpRequest.newBuilder()
            .uri(URI.create(yieldDataUrl))
            .GET()
            .build()
        val response = client.send(request, HttpResponse.BodyHandlers.ofString())
        return response.body()
    }
}