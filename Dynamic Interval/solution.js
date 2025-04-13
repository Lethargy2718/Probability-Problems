function F(n, k, dp = {}) {
    if (k < 0 || k > n) return 0;
    if (n === 1) return (k === 0 || k === 1) ? 0.5 : 0;

    if (!dp[n]) dp[n] = {};
    if (dp[n][k] !== undefined) return dp[n][k];

    let sum = 0;
    for (let i = k; i <= n; i++) {
        sum += (1 / (i + 1)) * F(n - 1, i - 1, dp);
    }
    dp[n][k] = sum;
    return sum;
}

// Examples
console.log(F(21, 3)); // 0.061313197162577215
console.log(F(13, 9)); // 9.397108566079095e-7
