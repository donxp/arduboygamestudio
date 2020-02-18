@echo off
cd arduino-cli
echo Compiling
arduino-cli compile --fqbn arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx HelloWorld
pause