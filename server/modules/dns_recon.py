import httpx
from modules.base import BaseModule
from typing import List, Dict, Any

class DNSReconModule(BaseModule):
    @property
    def name(self) -> str:
        return "DNS_PASSIVE"

    @property
    def description(self) -> str:
        return "Passive DNS subdomain discovery via crt.sh"

    async def execute(self, target: str) -> List[Dict[str, Any]]:
        results = []
        # Using crt.sh as a passive source for subdomains via certificates
        url = f"https://crt.sh/?q=%25.{target}&output=json"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    # Filter and unique the subdomains
                    subdomains = set()
                    for entry in data:
                        name_value = entry.get("name_value", "")
                        for sub in name_value.split("\n"):
                            if sub.strip() and sub.strip() != target:
                                # Basic validation to filter out wildcards
                                if not sub.strip().startswith("*"):
                                    subdomains.add(sub.strip())
                    
                    for sub in subdomains:
                        results.append(self.create_entity("subdomain", sub))
                else:
                    results.append(self.create_entity("system_info", f"DNS lookup returned status {response.status_code}"))
        except httpx.TimeoutException:
            results.append(self.create_entity("system_info", "DNS lookup timed out - service may be unavailable"))
        except httpx.NetworkError:
            results.append(self.create_entity("system_info", "Network unavailable for DNS lookup"))
        except Exception as e:
            # In a real app, we'd log this
            results.append(self.create_entity("system_info", f"DNS lookup unavailable: {type(e).__name__}"))
            
        return results
