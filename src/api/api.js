const BASE_URL = "http://localhost:8080";

const getStatusMessage = (status) => {
  switch (status) {
    case 400: return "Bad request. Please check your input.";
    case 401: return "Your session has expired. Please login again.";
    case 403: return "You don't have permission to do this.";
    case 404: return "Resource not found.";
    case 422: return "Validation failed. Please check your input.";
    case 500: return "Server error. Please try again later.";
    case 502: return "Bad gateway. Please try again.";
    case 503: return "Service unavailable. Please try again later.";
    default: return "Something went wrong. Please try again.";
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const isFormUrlEncoded =
      options.headers?.["Content-Type"] === "application/x-www-form-urlencoded";

    const isFormData = options.body instanceof FormData;

    const fetchOptions = {
      credentials: "include",
      ...options,
    };

    // Ensure headers object exists
    if (!fetchOptions.headers) {
      fetchOptions.headers = {};
    }

    // Handle body
    if (options.body) {
      if (isFormData) {
        // ✅ Multipart: let browser handle Content-Type
        fetchOptions.body = options.body;

        if (fetchOptions.headers["Content-Type"]) {
          delete fetchOptions.headers["Content-Type"];
        }

      } else if (isFormUrlEncoded) {
        fetchOptions.body = options.body;

      } else if (typeof options.body !== "string") {
        fetchOptions.body = JSON.stringify(options.body);
      }
    }

    // Set JSON header only when appropriate
    if (
      !isFormUrlEncoded &&
      !isFormData &&
      !fetchOptions.headers["Content-Type"]
    ) {
      fetchOptions.headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {
        success: response.ok,
        message: response.ok
          ? "Success"
          : getStatusMessage(response.status),
      };
    }

    if (!response.ok) {
      const shouldRedirect = options.redirectErrors !== false;
      const redirectStatuses = [401, 403, 404, 500, 502, 503];

      if (shouldRedirect && redirectStatuses.includes(response.status)) {
        const redirectError = new Error(
          `Redirecting to ${response.status} page`
        );
        redirectError.redirect = true;
        redirectError.status = response.status;
        throw redirectError;
      }

      const error = new Error();
      error.status = response.status;
      error.data = {
        success: false,
        message:
          data?.message && data.message.length < 100
            ? data.message
            : getStatusMessage(response.status),
      };
      throw error;
    }

    return data.data || data;

  } catch (error) {
    if (error.redirect) throw error;
    if (error.data) throw error;

    const networkError = new Error();
    networkError.status = 0;
    networkError.data = {
      success: false,
      message: "Network error. Please check your connection.",
    };
    throw networkError;
  }
};