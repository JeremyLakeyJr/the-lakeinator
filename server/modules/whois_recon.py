import httpx
from modules.base import BaseModule
from typing import List, Dict, Any

class WHOISReconModule(BaseModule):
    @property
    def name(self) -> str:
        return "WHOIS_DATA"

    @property
    def description(self) -> str:
        return "Extract registration and ownership metadata (Passive API)"

    async def execute(self, target: str) -> List[Dict[str, Any]]:
        # Using a public RDAP API for structured whois-like data
        url = f"https://rdap.org/domain/{target}"
        results = []
        
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract registrar
                    registrar = data.get("port43", "Unknown")
                    if registrar != "Unknown":
                        results.append(self.create_entity("registrar", registrar))
                    
                    # Extract events (creation, expiration)
                    for event in data.get("events", []):
                        action = event.get("eventAction")
                        date = event.get("eventDate")
                        if action and date:
                            results.append(self.create_entity("domain_event", f"{action}: {date}"))
                elif response.status_code == 404:
                    results.append(self.create_entity("system_info", "Domain not found in WHOIS database"))
                else:
                    results.append(self.create_entity("system_info", f"WHOIS lookup returned status {response.status_code}"))
        except httpx.TimeoutException:
            results.append(self.create_entity("system_info", "WHOIS lookup timed out - service may be unavailable"))
        except httpx.NetworkError:
            results.append(self.create_entity("system_info", "Network unavailable for WHOIS lookup"))
        except Exception as e:
            results.append(self.create_entity("system_info", f"WHOIS lookup unavailable: {type(e).__name__}"))
            
        return results
