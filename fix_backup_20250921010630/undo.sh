#!/bin/bash
echo "Restoring original files..."
cp "fix_backup_20250921010630/src/services/data-service.ts" src/services/data-service.ts 2>/dev/null || true
cp "fix_backup_20250921010630/src/app/layout.tsx" src/app/layout.tsx 2>/dev/null || true
echo "Restore complete."
