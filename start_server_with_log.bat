@echo off
chcp 65001 > nul
cd /d C:\xampp\htdocs\mysite\운세플랫폼
echo 서버 시작 중...
node server.js > server_log.txt 2>&1
echo 서버 종료됨
pause
