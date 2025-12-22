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
            return [self.create_entity("system_info", "Shodan API Key missing. Please set SHODAN_API_KEY environment variable to enable IoT scanning.")]

        url = f"https://api.shodan.io/shodan/host/search?key={api_key}&query=hostname:{target}"
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    for match in data.get("matches", []):
                        ip = match.get("ip_str")
                        port = match.get("port")
                        org = match.get("org", "Unknown")
                        location = match.get("location", {})
                        lat = location.get("latitude")
                        lon = location.get("longitude")
                        
                        results.append(self.create_entity("ip_address", ip, {
                            "org": org,
                            "lat": lat,
                            "lon": lon,
                            "city": location.get("city"),
                            "country": location.get("country_name")
                        }))
                        results.append(self.create_entity("open_port", f"{ip}:{port}", {"service": match.get("data")}))
                elif response.status_code == 401:
                    results.append(self.create_entity("error", "Invalid Shodan API Key"))
                        
        except Exception as e:
            results.append(self.create_entity("error", str(e), {"context": "Shodan lookup"}))
            
        return results
