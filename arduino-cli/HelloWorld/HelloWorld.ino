#include <Arduboy2.h>
Arduboy2 arduboy;
#include <ArduboyTones.h>
#define ARDBITMAP_SBUF arduboy.getBuffer()
#include <ArdBitmap.h>
#include "Tinyfont.h"
Tinyfont tinyfont = Tinyfont(arduboy.sBuffer, Arduboy2::width(), Arduboy2::height());
ArduboyTones sound(arduboy.audio.enabled);
const unsigned char invisible [] PROGMEM = {};

const unsigned char *spriteArray[] = {
invisible
};
int randomRange(int lower, int upper){
return (rand() % (upper - lower)) + lower;}

void wait(int milis){
delay(milis);
}

class GameObject {
public:
int xPos;
int yPos;
int spriteIndex;
int spriteHeight = 8, spriteWidth = 8;
bool initial = true;
int instanceNumber;
Rect mainRect;
GameObject(){}
GameObject(int x,int y,int mySpriteIndex,int sprH,int sprW,int instNumber){
xPos = x;
yPos = y;
instanceNumber = instNumber;
spriteIndex = mySpriteIndex;
spriteWidth = sprW;
spriteHeight = sprH;
mainRect.x = xPos;
mainRect.y = yPos;
mainRect.width = spriteWidth;
mainRect.height = spriteHeight;
drawSprite();
}
boolean checkForCollision(GameObject* other){
if (arduboy.collide(mainRect, other->getRect())) {
return true;
 }else{
return false;
}
}

Rect getRect(){
 return mainRect;
}
 int getSpriteHeight(){
return spriteHeight;
}
 int getSpriteWidth(){
return spriteWidth;
}
void changeXByAmount(int incrementAmount) {  
xPos = xPos + incrementAmount;
mainRect.x = xPos;
}
 void changeYByAmount(int incrementAmount) {
yPos = yPos + incrementAmount;
mainRect.y = yPos;
}
public : void changeXpos(int newX) {
xPos = newX;
mainRect.x = newX;
}
public : void changeYpos(int newY) {
yPos = newY;
mainRect.y = newY;
}
void setSprite(int spriteInd,int spriteW,int spriteH){
spriteIndex = spriteInd;
spriteHeight = spriteH;
spriteWidth = spriteW;
mainRect.width = spriteW;
mainRect.height = spriteH;
}
virtual void mainFunction(){

}
void drawSprite(){
arduboy.drawBitmap(xPos, yPos, spriteArray[spriteIndex],spriteWidth,spriteHeight,1);
}
};
const int arraySize = 1;
GameObject *allObjects[arraySize];

class mySubClass0 : public GameObject {
public:
mySubClass0(){}
mySubClass0(int x, int y, int spr,int sprH,int sprW,int inst):
GameObject(x,y,spr,sprH,sprW,inst){
arduboy.print("");
}

void mainFunction() override {
//seperator
if(initial){
  initial = false;
    setSprite(0,0,0);
    changeXpos(30);
    changeYpos(30);

  };

drawSprite();
}

};
void gameObjectCreation(){
mySubClass0 objName0_0(0,0,0,0,0,1);
allObjects[0] = &objName0_0;
}
void setup() {
arduboy.begin();
arduboy.setFrameRate(20);
arduboy.initRandomSeed();
arduboy.flipVertical(true);
arduboy.flipHorizontal(true);
gameObjectCreation();
}

void loop() {
if (!(arduboy.nextFrame())){
return;
}
arduboy.clear(); //clears the screen
for (int i = 0; i < arraySize; i++){ 
allObjects[i]->mainFunction();
}
arduboy.display();
}
