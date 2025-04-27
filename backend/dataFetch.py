import json
from serpapi import GoogleSearch

# Initialize an empty list to store all the results
all_results = []

# Start fetching results from the first page
start = 0

while True:
    params = {
        "api_key": "11b2b9a31555190c72c95c3e3d83d4a72cc609c662125a52234fd3c0e7ea8e40",  # Your API key
        "engine": "google_local",
        "google_domain": "google.com.np",
        "q": "laundry",
        "hl": "en",
        "gl": "np",
        "location": "Kathmandu, Nepal",
        "start": start  # Page offset (for pagination)
    }

    # Perform the search
    search = GoogleSearch(params)
    results = search.get_dict()

    # Get the local results (businesses)
    local_results = results.get("local_results", [])
    
    # If no results are returned, stop the loop (end of pagination)
    if not local_results:
        break

    # Append the results to the all_results list
    all_results.extend(local_results)

    # Print how many results we have so far
    print(f"Fetched {len(all_results)} results...")

    # Increment 'start' to fetch the next page of results (next 20)
    start += 20

# Save the results to a JSON file
with open("laundries_kathmandu_all.json", "w", encoding="utf-8") as f:
    json.dump(all_results, f, ensure_ascii=False, indent=4)

print("✅ Saved all results to laundries_kathmandu_all.json")
