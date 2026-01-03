#!/usr/bin/env python3
"""
Health check script for The Lakeinator backend.
Tests all API endpoints to ensure they're working correctly.
"""

import httpx
import sys
import asyncio

API_BASE = "http://localhost:8000"

async def check_health():
    """Check if the API is healthy"""
    print("🔍 The Lakeinator API Health Check")
    print("=" * 50)
    
    all_passed = True
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test 1: Root endpoint
            print("\n1. Testing root endpoint...")
            response = await client.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Status: {data.get('status')}")
                print(f"   ✅ Version: {data.get('version')}")
                print(f"   ✅ Modules: {len(data.get('modules', []))}")
            else:
                print(f"   ❌ Failed with status {response.status_code}")
                all_passed = False
            
            # Test 2: Directory endpoint
            print("\n2. Testing directory endpoint...")
            response = await client.get(f"{API_BASE}/api/directory")
            if response.status_code == 200:
                data = response.json()
                categories = data.get("categories", [])
                print(f"   ✅ Categories loaded: {len(categories)}")
                for cat in categories:
                    print(f"      - {cat['name']}: {len(cat['tools'])} tools")
            else:
                print(f"   ❌ Failed with status {response.status_code}")
                all_passed = False
            
            # Test 3: Recon endpoint (with example.com)
            print("\n3. Testing recon endpoint...")
            print("   Note: External API calls may fail in restricted environments")
            response = await client.get(f"{API_BASE}/api/recon?target=example.com")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Target: {data.get('target')}")
                print(f"   ✅ Entities found: {data.get('results_count')}")
                print(f"   ✅ Modules executed: {data.get('modules_executed')}")
            else:
                print(f"   ❌ Failed with status {response.status_code}")
                all_passed = False
            
            # Test 4: Input validation
            print("\n4. Testing input validation...")
            response = await client.get(f"{API_BASE}/api/recon?target=invalid_domain_!")
            if response.status_code == 400:
                print(f"   ✅ Invalid domain rejected (expected behavior)")
            else:
                print(f"   ⚠️  Unexpected status {response.status_code}")
    
    except httpx.ConnectError:
        print(f"\n❌ Cannot connect to {API_BASE}")
        print("   Make sure the server is running:")
        print("   cd server && uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("✅ All checks passed! The API is healthy.")
        return True
    else:
        print("⚠️  Some checks failed. Review the output above.")
        return False

if __name__ == "__main__":
    result = asyncio.run(check_health())
    sys.exit(0 if result else 1)
