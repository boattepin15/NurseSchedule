import numpy as np
shift = 3
day = 7
shiftWeek = day * shift
genshift = np.random.randint(2, size= shiftWeek)
_Nures = ['A', 'B']

shiftDream = [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1]
]


NurseDic = {}

for N in _Nures:
    NurseDic[N] =  genshift

print(NurseDic['A'])


newShift = np.random.randint(len(shiftDream), size = 1)

print(newShift)
NurseDic['A'][0:3] = [0, 0, 0]
NurseDic['A'][0:3] = newShift


print(NurseDic['A'])
