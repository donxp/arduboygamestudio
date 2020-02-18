@ECHO OFF
cd ../arduino-cli
ECHO Creating Default File Case
arduino-cli sketch new HelloWorld
ECHO Installing Arduino AVR
arduino-cli core install arduino:avr
ECHO Downloading homemade Arduboy-Libraries
arduino-cli  core update-index --additional-urls https://raw.githubusercontent.com/MrBlinky/Arduboy-homemade-package/master/package_arduboy_homemade_index.json
ECHO Checking Arduboy exists
arduino-cli core install arduboy-homemade:avr --additional-urls https://raw.githubusercontent.com/MrBlinky/Arduboy-homemade-package/master/package_arduboy_homemade_index.json
REM ECHO Running Test Compilation
REM arduino-cli compile --fqbn arduboy-homemade:avr:arduboy-homemade:based_on=promicro_alt,boot=cathy3k,core=arduboy-core,display=sh1106,flashselect=rx MyFirstSketch
pause