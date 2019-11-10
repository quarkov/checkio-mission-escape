"""
TESTS is a dict with all of your tests.
Keys for this will be the categories' names.
Each test is a dict with
    "input" -- input data for a user function
    "answer" -- your right answer
    "explanation" -- not necessarily a key, it's used for an additional info in animation.
"""

from random import randint
from math import inf


def judge(jar, fly):
    W, H, d = jar
    x0, y0, vx, vy = fly

    for _ in range(20):
        dx = W - x0 if vx >= 0 else x0
        dy = H - y0 if vy >= 0 else y0

        t_hit_x = dx/abs(vx) if vx != 0 else inf
        t_hit_y = dy/abs(vy) if vy != 0 else inf
        t_hit = min(t_hit_x, t_hit_y)

        x0 += vx * t_hit
        y0 += vy * t_hit

        vx = -vx if x0 in [0, W] else vx
        vy = -vy if y0 in [0, H] else vy

        if y0 == H and (W+d) / 2 > x0 > (W-d) / 2:
            return True
    return False


def test_set_make(n):
    rands = []
    for _ in range(n):
        W = randint(100, 1000)
        H = randint(W, 4*W)
        d = randint(0.1*W, 0.8*W)
        jar = [W, H, d]

        x0 = randint(0, W)
        y0 = randint(0, H)
        vx = randint(-2*W+1, 2*W-1)
        vy = randint(-2*H+1, 2*H-1)
        fly = [x0, y0, vx, vy]

        rands.append({"input": [jar, fly], "answer": judge(jar, fly)})
    return rands


TESTS = {
    "Basics": [
        {
            "input": [[1000, 500, 200], [0, 0, 100, 0]],
            "answer": 0,
            "explanation": "the fly's flying left and right only, no way out"
        },
        {
            "input": [[1000, 500, 200], [450, 50, 0, -100]],
            "answer": 1,
            "explanation": "fly down to the bottom then up directly to the jar's neck"
        },
        {
            "input": [[1000, 1000, 200], [450, 1000, 100, 0]],
            "answer": 0,
            "explanation": "too close, but still in"
        },
        {
            "input": [[1000, 1000, 200], [250, 250, -10, -50]],
            "answer": 0,
            "explanation": "looped flying"
        },
        {
            "input": [[1000, 2000, 200], [20, 35, 100, 175]],
            "answer": 1
        },
    ],
    "Extra": [
        {
            "input": [[1200, 2000, 400], [50, 1250, 1, 5]],
            "answer": 1
        },
        {
            "input": [[1200, 2000, 400], [700, 500, 100, -500]],
            "answer": 0
        },
        {
            "input": [[1200, 2000, 402], [700, 500, 100, -500]],
            "answer": 1
        },
        {
            "input": [[1200, 2000, 400], [1200, 2000, -40, 1]],
            "answer": 0
        },
        {
            "input": [[1200, 2000, 400], [0, 0, -600, -200]],
            "answer": 0
        },
        {
            "input": [[1200, 2000, 400], [0, 0, -600, -133]],
            "answer": 1
        },
        {
            "input": [[1200, 2000, 400], [0, 0, -600, -177]],
            "answer": 1
        },
        {
            "input": [[1200, 2000, 350], [600, 2000, 600, 1]],
            "answer": 1
        },
        {
            "input": [[1200, 2000, 350], [600, 1999, 600, 1]],
            "answer": 0
        }
    ],
    "Randoms": test_set_make(10)
}
