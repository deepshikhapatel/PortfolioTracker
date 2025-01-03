// Utility function for number formatting
export function priceFormat(value, short = false) {
    const sign = value >= 0 ? "" : "-";
    value = parseFloat(value);
    if (short) {
        value = Math.abs(value);
        if (value >= 1e7) return `${sign}₹${(value / 1e7).toFixed(2)}Cr`;
        if (value >= 1e5) return `${sign}₹${(value / 1e5).toFixed(2)}L`;
        if (value >= 1e3) return `${sign}₹${(value / 1e3).toFixed(2)}K`;
    }
    return value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
    });
}

// Utility function for parsing numbers
export function parseNum(value) {
    return parseFloat(value) === parseInt(value)
        ? parseInt(value)
        : parseFloat(parseFloat(value).toFixed(2));
}

// Utility function to calculate days between dates
export function calcDays(date1, date2 = new Date()) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const differenceInDays = Math.abs(
        Math.floor((secondDate - firstDate) / (1000 * 60 * 60 * 24)),
    );
    return differenceInDays;
}

// Creates a table cell with optional classes
export function createCell(content, classes = []) {
    const cell = document.createElement("td");
    cell.innerHTML = content;
    classes.forEach((cls) => cell.classList.add(cls));
    return cell;
}

//export function to load data into a table
export function loadDataTable(tableId, headers, cellData) {
    const table = document.getElementById(tableId);
    const tableHead = document.createElement("thead");

    const row = document.createElement("tr");
    headers.forEach((cell) => row.appendChild(createCell(cell)));
    tableHead.appendChild(row);
    table.appendChild(tableHead);

    const tableBody = document.createElement("tbody");
    cellData.forEach((record) => {
        const row = document.createElement("tr");
        record.forEach((cell) => row.appendChild(cell));
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
}

// Render summary sections
export function renderSummary(elementId, summaryItems) {
    const elem = document.getElementById(elementId);
    elem.innerHTML = summaryItems
        .map(
            (item) => `
            <div class="col-lg-3 col-6">
                <div class="small-box ${item.colorClass}">
                    <div class="inner">
                        <h4>${item.value}</h4>
                        <h6>${item.label}</h6>
                    </div>
                    <div class="icon">
                        <i class="${item.iconClass}"></i>
                    </div>
                    <a href="${item.href}" class="small-box-footer">
                        More info <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        `,
        )
        .join("");
}

export async function fetchApiData(file_name) {
    try {
        if (file_name === undefined) {
            throw new Error("Parameter 'file_name' is required");
        }
        // IMPORTANT: Do not modify this variable `apiPath`. It will be automatically updated during production deployment
        // via the GitHub Actions workflow defined in ./.github/workflows/deploy_github_pages.yml
        const apiPath = `../DATA/API/ptprashanttripathi/${file_name}`;
        const apiResponse = await fetch(apiPath);

        // Validate HTTP response status
        if (!apiResponse.ok) {
            throw new Error(
                `HTTP error!\napi_path: ${apiPath}\nstatus: ${apiResponse.status}`,
            );
        }

        // Parse and return the JSON data
        const apiData = await apiResponse.json();
        return apiData;
    } catch (error) {
        console.error("Error fetching API data:");
        throw error; // Re-throw the error for further handling
    }
}

export function updated_header_footer(last_updated_on) {
    // Create a Date object from the date string
    last_updated_on = new Date(last_updated_on);

    // Create and append the last-modified meta tag
    document
        .querySelector("meta[http-equiv='last-modified']")
        .setAttribute("content", last_updated_on.toUTCString());

    // Create and append Open Graph updated time
    document
        .querySelector("meta[property='og:updated_time']")
        .setAttribute("content", last_updated_on.toUTCString());

    // Create and append Twitter updated time
    document
        .querySelector("meta[name='twitter:updated_time']")
        .setAttribute("content", last_updated_on.toUTCString());

    // Create and append Dublin Core date
    document
        .querySelector("meta[name='DC.date']")
        .setAttribute("content", last_updated_on.toUTCString());

    // Set structured data for last modified date
    const jsonLdScript = document.querySelector(
        "script[type='application/ld+json']",
    );
    jsonLdScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: window.location.href,
        dateModified: last_updated_on.toISOString(),
    });

    // Display the last updated date in the body
    const lastUpdatedElement = document.querySelector(".main-footer");
    lastUpdatedElement.innerHTML = `
    <div class="row">
        <div class="col">
            <b>Copyright</b> © 2023-${new Date().getFullYear()}
            <a
                href="https://github.com/ptprashanttripathi/PortfolioTracker"
                >@PtPrashantTripathi</a
            >
            <br />All rights reserved.
        </div>
        <div class="col text-right">
            <strong>Last updated On :</strong> ${last_updated_on.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Calcutta",
                    timeZoneName: "short",
                },
            )}
        </div>
    </div>
    `;
}
