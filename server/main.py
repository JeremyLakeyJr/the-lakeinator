import json
import os
import asyncio
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from modules.dns_recon import DNSReconModule
from modules.whois_recon import WHOISReconModule
from modules.shodan_recon import ShodanReconModule

app = FastAPI(title="The Lakeinator API", version="0.1.0")

# Register modules
RECON_MODULES = [
    DNSReconModule(),
    WHOISReconModule(),
    ShodanReconModule()
]

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to The Lakeinator Intelligence Core", "status": "online"}

@app.get("/api/directory")
async def get_directory():
    file_path = "server/data/directory.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Directory data not found")
    
    with open(file_path, "r") as f:
        data = json.load(f)
    return data

@app.get("/api/recon")
async def run_recon(target: str = Query(..., description="The domain or IP to investigate")):
    if not target:
        raise HTTPException(status_code=400, detail="Target is required")
    
    tasks = [module.execute(target) for module in RECON_MODULES]
    module_results = await asyncio.gather(*tasks)
    
    # Flatten results
    flat_results = []
    for results in module_results:
        flat_results.extend(results)
        
    return {
        "target": target,
        "results_count": len(flat_results),
        "entities": flat_results
    }
