document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const summarizeButton = document.getElementById("summarizeButton");
    const summaryOutput = document.getElementById("summaryOutput");
    const summaryText = document.getElementById("summaryText");

    // Character counter and validation
    textInput.addEventListener("input", () => {
        const charCount = textInput.value.length;
        if (charCount < 500) {
            summarizeButton.textContent = `Enter at least 500 characters (Current: ${charCount})`;
            summarizeButton.disabled = true;
        } else {
            summarizeButton.textContent = "Summarize";
            summarizeButton.disabled = false;
        }
    });

    // Summarize button click event
    summarizeButton.addEventListener("click", async () => {
        const text = textInput.value;

        // Ensure the text meets the minimum character requirement
        if (text.length < 500) {
            alert("Please enter at least 500 characters to generate a summary.");
            return;
        }

        // Update button state to indicate processing
        summarizeButton.textContent = "Summarizing...";
        summarizeButton.disabled = true;

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
                },
                
                body: JSON.stringify({
                    inputs: text,
                    parameters: { max_length: 150, min_length: 50, do_sample: false },
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("API Error:", errorDetails);
                throw new Error(errorDetails.error || "Failed to fetch summary. Please try again.");
            }

            const data = await response.json();

            // Display the summary result
            summaryText.textContent = data[0]?.summary_text || "No summary was generated. Please try again with a different text.";
            summaryOutput.style.display = "block";
        } catch (error) {
            summaryText.textContent = "An error occurred while summarizing the text. Please try again later.";
            summaryOutput.style.display = "block";
            console.error("Error:", error);
        } finally {
            summarizeButton.textContent = "Summarize";
            summarizeButton.disabled = false;
        }
    });
});
