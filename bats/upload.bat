@echo off
cd ../arduino-cli
echo Uploading
rem first arg should be the COM Port
arduino-cli upload -p %1 --fqbn arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx --log-level debug -v HelloWorld
pause