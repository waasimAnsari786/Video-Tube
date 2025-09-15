// 🔁 requestWithRetry service
// Handles automatic retries for API requests with configurable options.
// Features:
//   - Retries only on 429 (Too Many Requests) or 5xx server errors.
//   - Uses exponential backoff with jitter to avoid thundering herd issues.
//   - Supports cancellation (does not retry if the request was aborted).
//   - Returns normalized errors when retries are exhausted.
// Purpose: Provides resilient request handling for unstable networks or rate-limited APIs,
// making client-side API calls more reliable and fault-tolerant.

const requestWithRetry = async function (fn, options = {}, attempt = 1) {
  const { retries = 2, delay = 500 } = options;

  try {
    const response = await fn(); // Attempt the request
    return response; // ✅ Success
  } catch (err) {
    console.log(err);

    // 🔴 Do not retry cancelled requests
    if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
      throw {
        message: "Request cancelled",
        errorCode: "REQUEST_CANCELLED",
      };
    }

    // Extract status code if present
    const status = err.response?.status;

    // ✅ Retry only on 429 (Too Many Requests) or 5xx errors
    const shouldRetry = status === 429 || (status >= 500 && status <= 599);

    if (shouldRetry && attempt <= retries) {
      // Base exponential backoff
      let backoff = delay * Math.pow(2, attempt - 1);

      // Add jitter (randomize delay between 50%–100% of backoff)
      const jitterFactor = 0.5 + Math.random() * 0.5;
      backoff = Math.floor(backoff * jitterFactor);

      await new Promise((res) => setTimeout(res, backoff));
      return requestWithRetry(fn, options, attempt + 1); // 🔁 Recursive retry
    }

    // 🚫 No retry → throw normalized error
    throw (
      err.response?.data || {
        message: "Request failed",
        errorCode: "REQUEST_ERROR",
      }
    );
  }
};

export default requestWithRetry;
