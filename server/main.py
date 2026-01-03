import json
import os
import asyncio
import re
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from modules.dns_recon import DNSReconModule
from modules.whois_recon import WHOISReconModule
from modules.shodan_recon import ShodanReconModule

app = FastAPI(
    title="The Lakeinator API", 
    version="1.0.0",
    description="OSINT Intelligence Core API for passive reconnaissance and data aggregation"
)

# Register modules
RECON_MODULES = [
    DNSReconModule(),
    WHOISReconModule(),
    ShodanReconModule()
]

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_valid_domain(domain: str) -> bool:
    """Validate domain name format"""
    # Basic domain validation regex
    pattern = r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
    return bool(re.match(pattern, domain))

def is_valid_ip(ip: str) -> bool:
    """Validate IP address format"""
    pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    return bool(re.match(pattern, ip))

@app.get("/")
async def root():
    return {
        "message": "Welcome to The Lakeinator Intelligence Core",
        "status": "online",
        "version": "1.0.0",
        "modules": [{"name": m.name, "description": m.description} for m in RECON_MODULES]
    }

@app.get("/api/directory")
async def get_directory():
    file_path = "data/directory.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Directory data not found")
    
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid directory data format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading directory: {str(e)}")

@app.get("/api/recon")
async def run_recon(
    target: str = Query(
        ..., 
        description="The domain or IP address to investigate",
        min_length=3,
        max_length=253
    )
):
    # Sanitize and validate target
    target = target.strip().lower()
    
    if not target:
        raise HTTPException(status_code=400, detail="Target parameter is required")
    
    # Validate target is either a valid domain or IP
    if not (is_valid_domain(target) or is_valid_ip(target)):
        raise HTTPException(
            status_code=400, 
            detail="Invalid target format. Please provide a valid domain name (e.g., example.com) or IP address"
        )
    
    try:
        # Execute all modules concurrently
        tasks = [module.execute(target) for module in RECON_MODULES]
        module_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Flatten results and handle any exceptions
        flat_results = []
        for i, results in enumerate(module_results):
            if isinstance(results, Exception):
                # If a module raised an exception, log it and add an error entity
                module_name = RECON_MODULES[i].name
                flat_results.append({
                    "module": module_name,
                    "type": "system_info",
                    "value": f"Module {module_name} encountered an error",
                    "metadata": {"error": str(results)}
                })
            else:
                flat_results.extend(results)
            
        return {
            "target": target,
            "results_count": len(flat_results),
            "entities": flat_results,
            "modules_executed": len(RECON_MODULES)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error during reconnaissance: {str(e)}"
        )
