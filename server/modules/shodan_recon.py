import httpx
import os
from modules.base import BaseModule
from typing import List, Dict, Any

class ShodanReconModule(BaseModule):
    @property
    def name(self) -> str:
        return "SHODAN_IOT"

    @property
    def description(self) -> str:
        return "Internet-connected device discovery and port scanning"

    async def execute(self, target: str) -> List[Dict[str, Any]]:
        api_key = os.getenv("SHODAN_API_KEY")
        results = []
        
        # If no API key, return a simulation/instruction entity
        if not api_key:
            return [self.create_entity("system_info", "Shodan API Key not configured. Set SHODAN_API_KEY environment variable to enable IoT device scanning.")]

        url = f"https://api.shodan.io/shodan/host/search?key={api_key}&query=hostname:{target}"
        
        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    matches = data.get("matches", [])
                    
                    if not matches:
                        results.append(self.create_entity("system_info", "No IoT devices found for this target"))
                    
                    for match in matches:
                        ip = match.get("ip_str")
                        port = match.get("port")
                        org = match.get("org", "Unknown")
                        location = match.get("location", {})
                        lat = location.get("latitude")
                        lon = location.get("longitude")
                        
                        if ip:
                            results.append(self.create_entity("ip_address", ip, {
                                "org": org,
                                "lat": lat,
                                "lon": lon,
                                "city": location.get("city"),
                                "country": location.get("country_name")
                            }))
                        if ip and port:
                            results.append(self.create_entity("open_port", f"{ip}:{port}", {"service": match.get("data")}))
                elif response.status_code == 401:
                    results.append(self.create_entity("system_info", "Invalid Shodan API Key"))
                elif response.status_code == 403:
                    results.append(self.create_entity("system_info", "Shodan API access forbidden - check subscription"))
                else:
                    results.append(self.create_entity("system_info", f"Shodan lookup returned status {response.status_code}"))
        except httpx.TimeoutException:
            results.append(self.create_entity("system_info", "Shodan lookup timed out - service may be unavailable"))
        except httpx.NetworkError:
            results.append(self.create_entity("system_info", "Network unavailable for Shodan lookup"))
        except Exception as e:
            results.append(self.create_entity("system_info", f"Shodan lookup unavailable: {type(e).__name__}"))
            
        return results
