#include <stdio.h>

#define index(x, y) (((x)%5)+5*((y)%5))

unsigned int KeccakRhoOffsets[25];

int main () {
    unsigned int x, y, t, newX, newY;

    KeccakRhoOffsets[index(0, 0)] = 0;
    x = 1;
    y = 0;
    for(t=0; t<24; t++) {
        KeccakRhoOffsets[index(x, y)] = ((t+1)*(t+2)/2) % 64;
        newX = (0*x+1*y) % 5;
        newY = (2*x+3*y) % 5;
        x = newX;
        y = newY;
    }

    printf("var P1600_RHO_OFFSETS = [");
    for (int i = 0; i < 25; ++i) printf("%d, ", KeccakRhoOffsets[i]);
    printf("]\n");

    return 0;
}
