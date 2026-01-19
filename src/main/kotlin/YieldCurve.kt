package org.mfi

data class YieldCurve(
    val maturities: List<String> = emptyList(),
    val rates: List<Double> = emptyList()
)
