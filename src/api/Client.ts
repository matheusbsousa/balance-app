import {BASE_URL} from "../utils/Constants.ts";

export async function fetchData(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(BASE_URL + url, options)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response
}


