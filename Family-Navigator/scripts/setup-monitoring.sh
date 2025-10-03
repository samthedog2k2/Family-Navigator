#!/usr/bin/env bash
# setup-monitoring.sh
# Clean 10-second system diagnostics with "Monitoring complete" footer.
# Hides Firebase shell noise and fixes previous EOF issue.

if [ ! -f dev.nix ]; then
  cat <<'NIX' > dev.nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = with pkgs; [ htop sysstat procps coreutils gawk util-linux ];
}
NIX
fi

echo "Starting 10-second system monitoring..."
nix-shell dev.nix --pure --run '
  YELLOW="\033[1;33m"; CYAN="\033[1;36m"; GREEN="\033[1;32m"; RESET="\033[0m";

  echo -e "${CYAN}======================================";
  echo "        SYSTEM MONITOR SNAPSHOT       ";
  echo -e "======================================${RESET}";

  echo;
  echo -e "${YELLOW}===== SYSTEM INFO =====${RESET}";
  uname -a | tee sysinfo.log;

  echo;
  echo -e "${YELLOW}===== MEMORY SNAPSHOT =====${RESET}";
  free -h | tee mem.log;

  echo;
  echo -e "${YELLOW}===== DISK SNAPSHOT =====${RESET}";
  df -hT | tee disk.log;

  echo;
  echo -e "${YELLOW}===== CPU MONITOR (10s) =====${RESET}";
  echo "Collecting CPU stats... (10s sample)";
  timeout 10 vmstat 1 | tee cpu.log;

  echo;
  echo -e "${CYAN}======================================";
  echo "            SUMMARY RESULTS           ";
  echo -e "======================================${RESET}";

  echo;
  echo -e "${GREEN}→ Average CPU usage (user + system):${RESET}";
  awk "NR>2 {usr+=\$13; sys+=\$14; n++} END {if (n>0) printf \"%.2f%%\\n\", (usr+sys)/n; else print \"N/A\"}" cpu.log;

  echo;
  echo -e "${GREEN}→ Memory used vs total:${RESET}";
  awk "/Mem:/ {printf \"%s / %s\\n\", \$3, \$2}" mem.log;

  echo;
  echo -e "${GREEN}→ Top 3 mounted filesystems:${RESET}";
  df -hT | head -n 4;

  echo;
  echo -e "${GREEN}→ Disk space summary:${RESET}";
  df -h --total | awk "/total/ {printf \"Total: %s | Available: %s\\n\", \$2, \$4}";

  echo;
  echo -e "${GREEN}→ Kernel and OS version:${RESET}";
  cat sysinfo.log;

  echo;
  echo -e "${CYAN}======================================";
  echo "Monitoring complete.";
  echo -e "======================================${RESET}";
' >/dev/stdout 2>/dev/null
