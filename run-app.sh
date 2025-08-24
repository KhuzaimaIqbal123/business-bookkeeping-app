#!/bin/bash
echo "🚀 Starting MERN App (Dev mode)..."
echo "----------------------------------"

# --- Backend Start ---
cd server
gnome-terminal -- bash -c "npm run dev; exec bash"
cd ..

# --- Frontend Start ---
cd frontend
gnome-terminal -- bash -c "npm run dev; exec bash"
cd ..

echo "✅ MERN App started. Open http://localhost:5173 in your browser."
