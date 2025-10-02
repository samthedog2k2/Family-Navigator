#!/bin/bash

# Create n8n workflow for simple cruise scraping
cat > ~/cruise-scraper-workflow.json << 'ENDOFFILE'
{
  "name": "Cruise Scraper - VacationsToGo",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "cruise-search",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "webhook-1",
      "name": "Webhook Receive",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "=https://www.vacationstogo.com/search.cfm?dest={{ $json.destination }}&port={{ $json.port }}",
        "options": {
          "redirect": {
            "redirect": {}
          }
        }
      },
      "id": "http-fetch",
      "name": "Fetch Cruise Page",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "const html = items[0].binary.data;\nconst cruises = [];\n\n// Simple regex to extract cruise data\nconst shipRegex = /<td[^>]*>\\s*<a[^>]*>([^<]+)<\\/a>/g;\nlet match;\n\nwhile ((match = shipRegex.exec(html)) !== null) {\n  cruises.push({\n    ship: match[1].trim()\n  });\n}\n\nreturn cruises.map(c => ({json: c}));"
      },
      "id": "parse-html",
      "name": "Parse HTML",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "respondWith": "={{ $json }}",
        "options": {}
      },
      "id": "respond",
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Webhook Receive": {
      "main": [[{"node": "Fetch Cruise Page", "type": "main", "index": 0}]]
    },
    "Fetch Cruise Page": {
      "main": [[{"node": "Parse HTML", "type": "main", "index": 0}]]
    },
    "Parse HTML": {
      "main": [[{"node": "Respond", "type": "main", "index": 0}]]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  }
}
ENDOFFILE

echo "✅ Workflow created at: ~/cruise-scraper-workflow.json"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Open n8n: http://35.209.56.56:5678"
echo "2. Click 'Import workflow'"
echo "3. Select file: $HOME/cruise-scraper-workflow.json"
echo "4. Click 'Activate' toggle"
echo "5. Test with:"
echo ""
echo "curl -X POST http://localhost:5678/webhook/cruise-search \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"destination\":\"Caribbean\",\"port\":\"Miami\"}'"
