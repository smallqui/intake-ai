/**
 * Sends an invoice or receipt to the server-side extraction API.
 *
 * In Demo Mode, the request skips the file upload and asks the server to
 * return mock extraction data instead.
 *
 * @param {File} file - Invoice or receipt file to process.
 * @param {boolean} isDemoMode - Whether to use mock data instead of live extraction.
 * @returns {Promise<Object>} Parsed invoice data returned by the extraction API.
 * @throws {Error} Throws when the API returns a non-success response.
 */
export const extractInvoiceData = async (
    file,
    isDemoMode,
) => {
    const formData = new FormData();

    formData.append(
        "isDemoMode",
        String(isDemoMode),
    );

    if (!isDemoMode){
        formData.append("file", file);
    }

    const response = await fetch(
        "/api/extract",
        {
            method: "POST",
            body: formData,
        },
    );

    if (!response.ok){
        const body = await response
            .json()
            .catch(() => ({}));

        const error = new Error(
            body.error ||
                "Extraction failed",
        );

        error.code =
            body.code || "GENERIC";

        throw error;
    }

    return response.json();
};