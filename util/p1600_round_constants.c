#include <stdio.h>

typedef unsigned char UINT8;
typedef unsigned long long UINT64;

UINT64 KeccakRoundConstants[24];

int LFSR86540(UINT8 *LFSR)
{
    int result = ((*LFSR) & 0x01) != 0;
    if (((*LFSR) & 0x80) != 0)
        /* Primitive polynomial over GF(2): x^8+x^6+x^5+x^4+1 */
        (*LFSR) = ((*LFSR) << 1) ^ 0x71;
    else
        (*LFSR) <<= 1;
    return result;
}

int main () {
    UINT8 LFSRstate = 0x01;
    unsigned int i, j, bitPosition;

    for(i=0; i<24; i++) {
        KeccakRoundConstants[i] = 0;
        for(j=0; j<7; j++) {
            bitPosition = (1<<j)-1; /* 2^j-1 */
            if (LFSR86540(&LFSRstate))
                KeccakRoundConstants[i] ^= (UINT64)1<<bitPosition;
        }
    }

    printf("var P1600_ROUND_CONSTANTS = [\n");
    for (i = 0; i < 24; ++i) printf("  0x%08llx, 0x%08llx,\n", KeccakRoundConstants[i] & 0xffffffff, KeccakRoundConstants[i] >> 32);
    printf("]\n");

    return 0;
}
