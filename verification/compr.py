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
