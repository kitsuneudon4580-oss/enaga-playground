const e={hello:{category:"ECS Basics",title:{en:"Hello ECS",ja:"はじめての ECS"},source:{en:`// Hello ECS — the simplest Enaga program.
// Define components, a phase, and a system.

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }

// Phases define execution order
phase Physics

// Systems contain the game logic
system Movement in Physics {
    foreach (pos: write Pos, vel: read Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;
    }
}
`,ja:`// はじめての ECS — 最も基本的な Enaga プログラム。
// コンポーネント、フェーズ、システムを定義します。

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }

// フェーズは実行順序を定義します
phase Physics

// システムにゲームロジックを記述します
system Movement in Physics {
    foreach (pos: write Pos, vel: read Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;
    }
}
`}},phases:{category:"ECS Basics",title:{en:"Phases & Ordering",ja:"フェーズと実行順序"},source:{en:`// Phases control execution order.
// Use "after" to define dependencies between phases.

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }

phase Input
phase Physics after Input
phase Render after Physics

system ReadInput in Input {
    foreach (vel: write Velocity) {
        vel.dx = 1.0_q;
    }
}

system ApplyPhysics in Physics {
    foreach (pos: write Pos, vel: read Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;
    }
}

system Draw in Render {
    foreach (pos: read Pos) {
        // Render phase runs last
        var screen_x = pos.x;
    }
}
`,ja:`// フェーズは実行順序を制御します。
// "after" で依存関係を定義します。

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }

phase Input
phase Physics after Input
phase Render after Physics

system ReadInput in Input {
    foreach (vel: write Velocity) {
        vel.dx = 1.0_q;
    }
}

system ApplyPhysics in Physics {
    foreach (pos: write Pos, vel: read Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;
    }
}

system Draw in Render {
    foreach (pos: read Pos) {
        // Render フェーズは最後に実行されます
        var screen_x = pos.x;
    }
}
`}},states:{category:"ECS Basics",title:{en:"State System",ja:"ステートシステム"},source:{en:`// States are boolean tags on entities.
// Use entity.add / entity.remove to toggle,
// and "has" / "not" to filter in foreach.

component Health { hp: q32_16 }
state Alive;
state Poisoned;
phase Update

// Only processes entities that are Alive and not Poisoned
system Heal in Update {
    foreach (h: write Health, has Alive, not Poisoned) {
        h.hp += 1.0_q;
    }
}

// Poison all living entities
system ApplyPoison in Update {
    foreach (h: read Health, has Alive) {
        entity.add(Poisoned);
    }
}

// Remove dead entities
system CheckDeath in Update {
    foreach (h: read Health, has Alive) {
        if (h.hp < 0.0_q) {
            entity.remove(Alive);
        }
    }
}
`,ja:`// ステートはエンティティに付与するブール値タグです。
// entity.add / entity.remove で切り替え、
// "has" / "not" で foreach のフィルタに使います。

component Health { hp: q32_16 }
state Alive;
state Poisoned;
phase Update

// Alive かつ Poisoned でないエンティティのみ処理
system Heal in Update {
    foreach (h: write Health, has Alive, not Poisoned) {
        h.hp += 1.0_q;
    }
}

// 生存中の全エンティティに毒を付与
system ApplyPoison in Update {
    foreach (h: read Health, has Alive) {
        entity.add(Poisoned);
    }
}

// 死亡判定
system CheckDeath in Update {
    foreach (h: read Health, has Alive) {
        if (h.hp < 0.0_q) {
            entity.remove(Alive);
        }
    }
}
`}},resources:{category:"ECS Basics",title:{en:"Resources",ja:"リソース"},source:{en:`// Resources are singleton data shared across systems.
// Access them with the "using" clause.

component Health { hp: q32_16, max_hp: q32_16 }
resource GameConfig { damage_rate: q32_16, heal_rate: q32_16 }
phase Update

system DamageOverTime in Update {
    using (cfg: read GameConfig)
    foreach (h: write Health) {
        h.hp -= cfg.damage_rate;
        h.hp = max(h.hp, 0.0_q);
    }
}

system Regenerate in Update {
    using (cfg: read GameConfig)
    foreach (h: write Health) {
        h.hp += cfg.heal_rate;
        h.hp = min(h.hp, h.max_hp);
    }
}
`,ja:`// リソースはシステム間で共有されるシングルトンデータです。
// "using" 句でアクセスします。

component Health { hp: q32_16, max_hp: q32_16 }
resource GameConfig { damage_rate: q32_16, heal_rate: q32_16 }
phase Update

system DamageOverTime in Update {
    using (cfg: read GameConfig)
    foreach (h: write Health) {
        h.hp -= cfg.damage_rate;
        h.hp = max(h.hp, 0.0_q);
    }
}

system Regenerate in Update {
    using (cfg: read GameConfig)
    foreach (h: write Health) {
        h.hp += cfg.heal_rate;
        h.hp = min(h.hp, h.max_hp);
    }
}
`}},archetype:{category:"ECS Basics",title:{en:"Archetypes",ja:"アーキタイプ"},source:{en:`// Archetypes group related components logically.
// Query multiple components in foreach to process "entity kinds".

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
component Health { hp: q32_16 }
phase Update

// Enemies are entities with Pos + Velocity + Health.
// foreach queries all three to process them together.
system MoveEnemies in Update {
    foreach (pos: write Pos, vel: read Velocity, hp: read Health) {
        if (hp.hp > 0.0_q) {
            pos.x += vel.dx;
            pos.y += vel.dy;
        }
    }
}
`,ja:`// アーキタイプは関連するコンポーネントを論理的にグループ化します。
// foreach で複数コンポーネントをクエリして「エンティティの種類」を処理します。

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
component Health { hp: q32_16 }
phase Update

// 敵は Pos + Velocity + Health を持つエンティティ。
// foreach で3つを同時にクエリして処理します。
system MoveEnemies in Update {
    foreach (pos: write Pos, vel: read Velocity, hp: read Health) {
        if (hp.hp > 0.0_q) {
            pos.x += vel.dx;
            pos.y += vel.dy;
        }
    }
}
`}},functions:{category:"ECS Basics",title:{en:"Functions",ja:"関数定義"},source:{en:`// User-defined functions with typed parameters and return values.

component Pos { x: q32_16, y: q32_16 }
component Target { tx: q32_16, ty: q32_16 }
phase Update

// A function that linearly interpolates between two values
fn my_lerp(a: q32_16, b: q32_16, t: q32_16) -> q32_16 {
    return a + (b - a) * t;
}

// Functions can call other functions
fn approach(current: q32_16, target: q32_16, speed: q32_16) -> q32_16 {
    var t = min(speed, 1.0_q);
    return my_lerp(current, target, t);
}

system MoveToTarget in Update {
    foreach (pos: write Pos, tgt: read Target) {
        pos.x = approach(pos.x, tgt.tx, 0.5_q * delta_time());
        pos.y = approach(pos.y, tgt.ty, 0.5_q * delta_time());
    }
}
`,ja:`// 型付き引数と戻り値を持つユーザー定義関数。

component Pos { x: q32_16, y: q32_16 }
component Target { tx: q32_16, ty: q32_16 }
phase Update

// 線形補間を行う関数
fn my_lerp(a: q32_16, b: q32_16, t: q32_16) -> q32_16 {
    return a + (b - a) * t;
}

// 関数から他の関数を呼び出せます
fn approach(current: q32_16, target: q32_16, speed: q32_16) -> q32_16 {
    var t = min(speed, 1.0_q);
    return my_lerp(current, target, t);
}

system MoveToTarget in Update {
    foreach (pos: write Pos, tgt: read Target) {
        pos.x = approach(pos.x, tgt.tx, 0.5_q * delta_time());
        pos.y = approach(pos.y, tgt.ty, 0.5_q * delta_time());
    }
}
`}},fixed_point:{category:"Type System",title:{en:"Fixed-Point Types",ja:"固定小数点型"},source:{en:`// Enaga uses fixed-point numbers instead of floating-point.
// This guarantees deterministic behavior (perfect for netcode/replays).
// Default type is q32_16 (32-bit total, 16-bit fraction).

component Precision {
    low: q8_4,        // 8-bit, 4 frac bits — range ±7.9
    medium: q16_8,    // 16-bit, 8 frac bits — range ±127
    standard: q32_16, // 32-bit, 16 frac bits — range ±32767 (default)
    high: q64_32      // 64-bit, 32 frac bits — range ±2 billion
}
phase Update

system Demo in Update {
    foreach (p: write Precision) {
        p.standard = 3.14_q;      // Suffix _q uses default format
        p.low = 1.5_q8_4;        // Explicit format suffix
        p.high = 123456.789_q64_32;
    }
}
`,ja:`// Enaga は浮動小数点の代わりに固定小数点数を使います。
// これにより決定論的な動作を保証します（ネットコード/リプレイに最適）。
// デフォルト型は q32_16（全32ビット、小数部16ビット）。

component Precision {
    low: q8_4,        // 8ビット、小数4ビット — 範囲 ±7.9
    medium: q16_8,    // 16ビット、小数8ビット — 範囲 ±127
    standard: q32_16, // 32ビット、小数16ビット — 範囲 ±32767（デフォルト）
    high: q64_32      // 64ビット、小数32ビット — 範囲 ±20億
}
phase Update

system Demo in Update {
    foreach (p: write Precision) {
        p.standard = 3.14_q;      // _q サフィックスでデフォルト形式
        p.low = 1.5_q8_4;        // 明示的な形式サフィックス
        p.high = 123456.789_q64_32;
    }
}
`}},integers:{category:"Type System",title:{en:"Integer Types",ja:"整数型"},source:{en:`// Enaga supports signed and unsigned integers of various sizes.
// Integers are separate from the default q32_16 fixed-point type.

component Flags {
    small: i8,        // -128 to 127
    medium: i16,      // -32768 to 32767
    byte: u8,         // 0 to 255
    index: u16        // 0 to 65535
}

component Stats {
    score: q32_16     // default fixed-point type
}
phase Update

system IntDemo in Update {
    foreach (f: write Flags) {
        // Integer assignments
        f.small = 42;
        f.byte = 255;
        f.index = 1000;
    }
}
`,ja:`// Enaga は様々なサイズの符号付き・符号なし整数をサポートします。
// 整数型はデフォルトの q32_16 固定小数点型とは別の型です。

component Flags {
    small: i8,        // -128 〜 127
    medium: i16,      // -32768 〜 32767
    byte: u8,         // 0 〜 255
    index: u16        // 0 〜 65535
}

component Stats {
    score: q32_16     // デフォルトの固定小数点型
}
phase Update

system IntDemo in Update {
    foreach (f: write Flags) {
        // 整数の代入
        f.small = 42;
        f.byte = 255;
        f.index = 1000;
    }
}
`}},quotient_clamp:{category:"Type System",title:{en:"Quotient & Clamp Types",ja:"商型とクランプ型"},source:{en:`// Quotient wraps values (like angles). Clamp saturates to a range.
// Use mod/max/min to implement these patterns.

component Character {
    facing: q32_16,
    hp: q32_16
}
phase Update

system Rotate in Update {
    foreach (c: write Character) {
        // Wrap angle: 350 + 20 => wraps to stay in 0..360
        c.facing += 20_q;
        if (c.facing >= 360_q) {
            c.facing -= 360_q;
        }
        // Clamp HP: never goes below 0
        c.hp -= 5_q;
        c.hp = max(c.hp, 0_q);
    }
}
`,ja:`// 商型は値をラップし（角度など）、クランプ型は範囲内に飽和します。
// mod/max/min でこれらのパターンを実装します。

component Character {
    facing: q32_16,
    hp: q32_16
}
phase Update

system Rotate in Update {
    foreach (c: write Character) {
        // 角度のラップ: 350 + 20 => 0..360 の範囲に収める
        c.facing += 20_q;
        if (c.facing >= 360_q) {
            c.facing -= 360_q;
        }
        // HPのクランプ: 0未満にならない
        c.hp -= 5_q;
        c.hp = max(c.hp, 0_q);
    }
}
`}},approx_eq:{category:"Type System",title:{en:"Approximate Equality",ja:"近似等号"},source:{en:`// Fixed-point comparisons should use approximate equality.
// The "+- tolerance" syntax checks if values are close enough.

component Pos { x: q32_16, y: q32_16 }
component Target { tx: q32_16, ty: q32_16 }
state Arrived;
phase Update

system CheckArrival in Update {
    foreach (p: read Pos, t: read Target, not Arrived) {
        // True if |p.x - t.tx| <= 0.5 AND |p.y - t.ty| <= 0.5
        if (p.x == t.tx +- 0.5_q) {
            if (p.y == t.ty +- 0.5_q) {
                entity.add(Arrived);
            }
        }
    }
}
`,ja:`// 固定小数点の比較には近似等号を使います。
// "+- 許容値" 構文で値が十分近いかチェックします。

component Pos { x: q32_16, y: q32_16 }
component Target { tx: q32_16, ty: q32_16 }
state Arrived;
phase Update

system CheckArrival in Update {
    foreach (p: read Pos, t: read Target, not Arrived) {
        // |p.x - t.tx| <= 0.5 かつ |p.y - t.ty| <= 0.5 なら true
        if (p.x == t.tx +- 0.5_q) {
            if (p.y == t.ty +- 0.5_q) {
                entity.add(Arrived);
            }
        }
    }
}
`}},trig_math:{category:"Math",title:{en:"Trigonometry & Math",ja:"三角関数と数学関数"},source:{en:`// Built-in math functions: sin, cos, tan, sqrt, abs, etc.
// Trigonometric functions use Taylor series with configurable order.

component Wave { angle: q32_16, value: q32_16 }
phase Update

system Oscillate in Update {
    foreach (w: write Wave) {
        w.angle += delta_time();

        // sin/cos with default precision (order 5)
        w.value = sin(w.angle) * 10_q;

        // sin with higher precision (order 9)
        var precise = sin(w.angle, 9);

        // Other math functions
        var magnitude = abs(w.value);
        var root = sqrt(magnitude);
        var limited = min(max(w.value, -5_q), 5_q);
        var rounded = round(w.value);
        var direction = sign(w.value);
    }
}
`,ja:`// 組み込み数学関数: sin, cos, tan, sqrt, abs など。
// 三角関数はテイラー級数で計算、精度の指定が可能です。

component Wave { angle: q32_16, value: q32_16 }
phase Update

system Oscillate in Update {
    foreach (w: write Wave) {
        w.angle += delta_time();

        // sin/cos デフォルト精度（次数 5）
        w.value = sin(w.angle) * 10_q;

        // より高精度な sin（次数 9）
        var precise = sin(w.angle, 9);

        // その他の数学関数
        var magnitude = abs(w.value);
        var root = sqrt(magnitude);
        var limited = min(max(w.value, -5_q), 5_q);
        var rounded = round(w.value);
        var direction = sign(w.value);
    }
}
`}},complex:{category:"Math",title:{en:"Complex Numbers",ja:"複素数"},source:{en:`// Complex numbers are first-class types in Enaga.
// Use polar/cis for rotation, arg/norm for analysis.

component WaveState { angle: q32_16, amplitude: q32_16 }
phase Simulation

system WaveEvolution in Simulation {
    foreach (w: write WaveState) {
        // Create complex number from polar form
        var z = polar(w.amplitude, w.angle);

        // Rotate by multiplying with cis(angle) = cos + i*sin
        var rotation = cis(1.5_q * delta_time());
        z = z * rotation;

        // Extract components
        w.angle = arg(z);         // Phase angle
        w.amplitude = norm(z);    // Magnitude

        // Other operations
        var conjugate = conj(z);  // Complex conjugate
        var re = real(z);         // Real part
        var im = imag(z);         // Imaginary part
    }
}
`,ja:`// 複素数は Enaga のファーストクラス型です。
// polar/cis で回転、arg/norm で解析します。

component WaveState { angle: q32_16, amplitude: q32_16 }
phase Simulation

system WaveEvolution in Simulation {
    foreach (w: write WaveState) {
        // 極形式から複素数を生成
        var z = polar(w.amplitude, w.angle);

        // cis(角度) = cos + i*sin の乗算で回転
        var rotation = cis(1.5_q * delta_time());
        z = z * rotation;

        // 成分の取り出し
        w.angle = arg(z);         // 偏角
        w.amplitude = norm(z);    // 絶対値

        // その他の操作
        var conjugate = conj(z);  // 共役複素数
        var re = real(z);         // 実部
        var im = imag(z);         // 虚部
    }
}
`}},quaternion:{category:"Math",title:{en:"Quaternion Rotation",ja:"四元数回転"},source:{en:`// Quaternions enable smooth 3D rotation without gimbal lock.
// Enaga supports them as a Cayley-Dickson extension type.

component Orientation { q: Quaternion }
component AngularVelocity { axis: vec3, speed: q32_16 }
phase Physics

fn make_rotation(axis: vec3, angle: q32_16) -> Quaternion {
    var half = angle * 0.5_q;
    var s = sin(half);
    var c = cos(half);
    var n = normalize(axis);
    return quaternion(c, n.x * s, n.y * s, n.z * s);
}

system Rotate in Physics {
    foreach (o: write Orientation, av: read AngularVelocity) {
        // Build a delta rotation quaternion
        var dq = make_rotation(av.axis, av.speed * delta_time());

        // Apply rotation by multiplication
        o.q = dq * o.q;
    }
}
`,ja:`// 四元数はジンバルロックのない滑らかな3D回転を実現します。
// Enaga ではケイリー＝ディクソン拡張型としてサポートしています。

component Orientation { q: Quaternion }
component AngularVelocity { axis: vec3, speed: q32_16 }
phase Physics

fn make_rotation(axis: vec3, angle: q32_16) -> Quaternion {
    var half = angle * 0.5_q;
    var s = sin(half);
    var c = cos(half);
    var n = normalize(axis);
    return quaternion(c, n.x * s, n.y * s, n.z * s);
}

system Rotate in Physics {
    foreach (o: write Orientation, av: read AngularVelocity) {
        // 差分回転クォータニオンを構築
        var dq = make_rotation(av.axis, av.speed * delta_time());

        // 乗算で回転を適用
        o.q = dq * o.q;
    }
}
`}},vectors:{category:"Math",title:{en:"Vectors & Matrices",ja:"ベクトルと行列"},source:{en:`// Built-in vector (vec2, vec3, vec4) and matrix (mat3, mat4) types.

component Spatial { pos: vec3, dir: vec3 }
phase Update

system VectorDemo in Update {
    foreach (s: write Spatial) {
        // Vector construction
        var forward = vec3(1_q, 0_q, 0_q);
        var up = vec3(0_q, 1_q, 0_q);

        // Vector operations
        var len = length(forward);
        var normalized = normalize(s.dir);
        var d = dot(forward, up);
        var perp = cross(forward, up);

        // Move along direction
        s.pos = s.pos + s.dir * delta_time();
    }
}
`,ja:`// 組み込みベクトル型 (vec2, vec3, vec4) と行列型 (mat3, mat4)。

component Spatial { pos: vec3, dir: vec3 }
phase Update

system VectorDemo in Update {
    foreach (s: write Spatial) {
        // ベクトルの構築
        var forward = vec3(1_q, 0_q, 0_q);
        var up = vec3(0_q, 1_q, 0_q);

        // ベクトル演算
        var len = length(forward);
        var normalized = normalize(s.dir);
        var d = dot(forward, up);
        var perp = cross(forward, up);

        // 方向に沿って移動
        s.pos = s.pos + s.dir * delta_time();
    }
}
`}},interpolation:{category:"Math",title:{en:"Interpolation",ja:"補間関数"},source:{en:`// Built-in interpolation functions for smooth animations.

component Anim { t: q32_16, x: q32_16, y: q32_16 }
phase Update

system Interpolate in Update {
    foreach (a: write Anim) {
        a.t += delta_time() * 0.1_q;
        var t = saturate(a.t);   // Clamp to [0, 1]

        // Linear interpolation
        a.x = lerp(0_q, 100_q, t);

        // Smooth interpolation (ease in-out)
        a.y = smoothstep(0_q, 1_q, t) * 100_q;

        // Other interpolation tools
        var fraction = fract(a.t);         // Fractional part
        var stepped = step(0.5_q, t);       // 0 if t < 0.5, else 1
        var inv = inverse_lerp(0_q, 100_q, a.x); // Reverse lerp
    }
}
`,ja:`// 滑らかなアニメーションのための組み込み補間関数。

component Anim { t: q32_16, x: q32_16, y: q32_16 }
phase Update

system Interpolate in Update {
    foreach (a: write Anim) {
        a.t += delta_time() * 0.1_q;
        var t = saturate(a.t);   // [0, 1] にクランプ

        // 線形補間
        a.x = lerp(0_q, 100_q, t);

        // 滑らかな補間（イーズイン・アウト）
        a.y = smoothstep(0_q, 1_q, t) * 100_q;

        // その他の補間ツール
        var fraction = fract(a.t);         // 小数部分
        var stepped = step(0.5_q, t);       // t < 0.5 なら 0、それ以外は 1
        var inv = inverse_lerp(0_q, 100_q, a.x); // 逆 lerp
    }
}
`}},easing:{category:"Math",title:{en:"Easing Functions",ja:"イージング関数"},source:{en:`// 21 easing functions for animations and transitions.
// Each takes a normalized t in [0, 1] and returns eased value.

component Anim { t: q32_16, value: q32_16 }
phase Update

system EasingDemo in Update {
    foreach (a: write Anim) {
        a.t += delta_time() * 0.01_q;
        var t = saturate(a.t);

        // Quadratic (gentle acceleration)
        var v1 = ease_in_quad(t);

        // Cubic (stronger acceleration)
        var v2 = ease_out_cubic(t);

        // Elastic (spring-like bounce)
        var v3 = ease_out_elastic(t);

        // Back (slight overshoot)
        var v4 = ease_in_out_back(t);

        // Bounce (bouncing ball)
        var v5 = ease_out_bounce(t);

        a.value = v1;
    }
}
`,ja:`// アニメーションとトランジション用の21種のイージング関数。
// 正規化された t ∈ [0, 1] を受け取り、イージング後の値を返します。

component Anim { t: q32_16, value: q32_16 }
phase Update

system EasingDemo in Update {
    foreach (a: write Anim) {
        a.t += delta_time() * 0.01_q;
        var t = saturate(a.t);

        // 二次関数（緩やかな加速）
        var v1 = ease_in_quad(t);

        // 三次関数（強い加速）
        var v2 = ease_out_cubic(t);

        // エラスティック（バネのような跳ね返り）
        var v3 = ease_out_elastic(t);

        // バック（わずかなオーバーシュート）
        var v4 = ease_in_out_back(t);

        // バウンス（弾むボール）
        var v5 = ease_out_bounce(t);

        a.value = v1;
    }
}
`}},movement:{category:"Game Patterns",title:{en:"Movement & Bounce",ja:"移動と壁反射"},source:{en:`// Classic game pattern: velocity-based movement with wall bouncing.

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
phase Physics

system Move in Physics {
    foreach (pos: write Pos, vel: write Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;

        // Bounce off walls at ±100
        if (pos.x > 100.0_q) {
            pos.x = 100.0_q;
            vel.dx = -vel.dx;
        }
        if (pos.x < -100.0_q) {
            pos.x = -100.0_q;
            vel.dx = -vel.dx;
        }
        if (pos.y > 100.0_q) {
            pos.y = 100.0_q;
            vel.dy = -vel.dy;
        }
        if (pos.y < -100.0_q) {
            pos.y = -100.0_q;
            vel.dy = -vel.dy;
        }
    }
}
`,ja:`// ゲームの定番パターン: 速度ベースの移動と壁での反射。

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
phase Physics

system Move in Physics {
    foreach (pos: write Pos, vel: write Velocity) {
        pos.x += vel.dx;
        pos.y += vel.dy;

        // ±100 の壁で反射
        if (pos.x > 100.0_q) {
            pos.x = 100.0_q;
            vel.dx = -vel.dx;
        }
        if (pos.x < -100.0_q) {
            pos.x = -100.0_q;
            vel.dx = -vel.dx;
        }
        if (pos.y > 100.0_q) {
            pos.y = 100.0_q;
            vel.dy = -vel.dy;
        }
        if (pos.y < -100.0_q) {
            pos.y = -100.0_q;
            vel.dy = -vel.dy;
        }
    }
}
`}},move_toward:{category:"Game Patterns",title:{en:"Movement Helpers",ja:"移動ヘルパー"},source:{en:`// Built-in movement utility functions.

component Pos { x: q32_16 }
component Target { x: q32_16 }
component Smooth { value: q32_16 }
phase Update

// move_toward: move at constant speed, stop when reached
system MoveToward in Update {
    foreach (p: write Pos, tgt: read Target) {
        p.x = move_toward(p.x, tgt.x, 5_q * delta_time());
    }
}

// decay: exponential decay (smooth damping)
system Damping in Update {
    foreach (s: write Smooth) {
        s.value = decay(s.value, 0_q, 0.5_q, delta_time());
    }
}
`,ja:`// 組み込みの移動ユーティリティ関数。

component Pos { x: q32_16 }
component Target { x: q32_16 }
component Smooth { value: q32_16 }
phase Update

// move_toward: 一定速度で移動し、到達したら停止
system MoveToward in Update {
    foreach (p: write Pos, tgt: read Target) {
        p.x = move_toward(p.x, tgt.x, 5_q * delta_time());
    }
}

// decay: 指数関数的減衰（滑らかなダンピング）
system Damping in Update {
    foreach (s: write Smooth) {
        s.value = decay(s.value, 0_q, 0.5_q, delta_time());
    }
}
`}},rng:{category:"Game Patterns",title:{en:"Random Numbers",ja:"乱数生成"},source:{en:`// Deterministic random number generation using PCG.
// Per-entity seeds are auto-derived from a master seed.

component Pos { x: q32_16, y: q32_16 }
component Stats { damage: q32_16, crit: q32_16 }
phase Init

system Scatter in Init {
    foreach (pos: write Pos) {
        // Random integer in range [lo, hi)
        pos.x = rand_range(-100, 100);
        pos.y = rand_range(-100, 100);
    }
}

system RandomStats in Init {
    foreach (s: write Stats) {
        // Random fixed-point in [0, 1)
        s.damage = rand() * 50_q;
        s.crit = rand();
    }
}
`,ja:`// PCG による決定論的乱数生成。
// エンティティごとのシードはマスターシードから自動導出されます。

component Pos { x: q32_16, y: q32_16 }
component Stats { damage: q32_16, crit: q32_16 }
phase Init

system Scatter in Init {
    foreach (pos: write Pos) {
        // 範囲 [lo, hi) のランダム整数
        pos.x = rand_range(-100, 100);
        pos.y = rand_range(-100, 100);
    }
}

system RandomStats in Init {
    foreach (s: write Stats) {
        // [0, 1) のランダム固定小数点数
        s.damage = rand() * 50_q;
        s.crit = rand();
    }
}
`}},weighted:{category:"Game Patterns",title:{en:"Weighted Selection",ja:"重み付き選択"},source:{en:`// Weighted random selection using Vose's Alias Method (O(1) sampling).
// Perfect for loot tables, AI behavior selection, etc.

// const declaration with weighted<symbol> type
const loot: weighted<symbol> = {
    .common: 70,
    .rare: 25,
    .legendary: 5
};

component Item { kind: q32_16 }
phase Update

system DropLoot in Update {
    foreach (it: write Item) {
        // pick() returns a random value based on weights
        it.kind = pick(loot);
    }
}
`,ja:`// Vose の Alias Method による重み付きランダム選択（O(1) サンプリング）。
// ドロップテーブル、AI行動選択などに最適です。

// const 宣言で weighted<symbol> 型を定義
const loot: weighted<symbol> = {
    .common: 70,
    .rare: 25,
    .legendary: 5
};

component Item { kind: q32_16 }
phase Update

system DropLoot in Update {
    foreach (it: write Item) {
        // pick() は重みに基づいてランダムに値を返す
        it.kind = pick(loot);
    }
}
`}},fixed_array:{category:"Game Patterns",title:{en:"Fixed-Length Arrays",ja:"固定長配列"},source:{en:`// Fixed-length arrays [T; N] with compile-time size.
// Supports sort, sort_desc, and element access.

component Inventory { slots: [q32_16; 4] }
component Scores { values: [q32_16; 4] }
phase Update

system SortInventory in Update {
    foreach (inv: write Inventory) {
        // Sort in ascending order
        sort(inv.slots);
    }
}

system AnalyzeScores in Update {
    foreach (s: write Scores) {
        // Access individual elements
        var first = s.values[0];
        var last = s.values[3];

        // Sort descending
        sort_desc(s.values);
    }
}
`,ja:`// コンパイル時にサイズが確定する固定長配列 [T; N]。
// sort、sort_desc、要素アクセスをサポートします。

component Inventory { slots: [q32_16; 4] }
component Scores { values: [q32_16; 4] }
phase Update

system SortInventory in Update {
    foreach (inv: write Inventory) {
        // 昇順ソート
        sort(inv.slots);
    }
}

system AnalyzeScores in Update {
    foreach (s: write Scores) {
        // 個別要素へのアクセス
        var first = s.values[0];
        var last = s.values[3];

        // 降順ソート
        sort_desc(s.values);
    }
}
`}},rotation_2d:{category:"Game Patterns",title:{en:"2D Rotation",ja:"2D回転"},source:{en:`// Built-in 2D rotation and angle functions.

component Pos { x: q32_16, y: q32_16 }
phase Update

system Spin in Update {
    foreach (p: write Pos) {
        // Rotate a 2D vector by an angle
        var v = vec2(p.x, p.y);
        var rotated = rotate2(v, delta_time());
        p.x = rotated.x;
        p.y = rotated.y;

        // Get the angle of a 2D vector
        var angle = angle_of(v);

        // Get perpendicular vector (90° rotation)
        var perp = perpendicular(v);
    }
}
`,ja:`// 組み込みの2D回転・角度関数。

component Pos { x: q32_16, y: q32_16 }
phase Update

system Spin in Update {
    foreach (p: write Pos) {
        // 2Dベクトルを角度で回転
        var v = vec2(p.x, p.y);
        var rotated = rotate2(v, delta_time());
        p.x = rotated.x;
        p.y = rotated.y;

        // 2Dベクトルの角度を取得
        var angle = angle_of(v);

        // 直交ベクトル（90°回転）を取得
        var perp = perpendicular(v);
    }
}
`}},relation_basic:{category:"Relations & Scenes",title:{en:"Relations (Parent-Child)",ja:"リレーション（親子関係）"},source:{en:`// Relations express entity-entity relationships.
// "via" lets you access a related entity's components.

component Pos { x: q32_16, y: q32_16 }
relation ChildOf;
state NeedsParent;
phase Update

// Access parent's Pos through the ChildOf relation
system FollowParent in Update {
    foreach (pos: write Pos, parent_pos: read Pos via ChildOf) {
        pos.x = parent_pos.x;
        pos.y = parent_pos.y;
    }
}

// Link entities with entity.link()
system AssignParent in Update {
    foreach (pos: read Pos, has NeedsParent) {
        entity.link(ChildOf, 0);
        entity.remove(NeedsParent);
    }
}
`,ja:`// リレーションはエンティティ間の関係を表現します。
// "via" で関連エンティティのコンポーネントにアクセスできます。

component Pos { x: q32_16, y: q32_16 }
relation ChildOf;
state NeedsParent;
phase Update

// ChildOf リレーションを通じて親の Pos にアクセス
system FollowParent in Update {
    foreach (pos: write Pos, parent_pos: read Pos via ChildOf) {
        pos.x = parent_pos.x;
        pos.y = parent_pos.y;
    }
}

// entity.link() でリレーションを設定
system AssignParent in Update {
    foreach (pos: read Pos, has NeedsParent) {
        entity.link(ChildOf, 0);
        entity.remove(NeedsParent);
    }
}
`}},relation_payload:{category:"Relations & Scenes",title:{en:"Relation Payloads",ja:"リレーションペイロード"},source:{en:`// Relations can carry data (payloads).
// Access payload fields via the relation name.

component Pos { x: q32_16, y: q32_16 }
relation ChildOf { offset_x: q32_16, offset_y: q32_16 };
phase Update

// Access parent position + relation offset
system ApplyOffset in Update {
    foreach (pos: write Pos, parent_pos: read Pos via ChildOf) {
        pos.x = parent_pos.x + ChildOf.offset_x;
        pos.y = parent_pos.y + ChildOf.offset_y;
    }
}

// Check if entity has a relation
system OrphanCheck in Update {
    foreach (pos: write Pos) {
        if (has_relation(ChildOf)) {
            pos.x += 1_q;
        }
    }
}
`,ja:`// リレーションはデータ（ペイロード）を持てます。
// ペイロードフィールドにはリレーション名でアクセスします。

component Pos { x: q32_16, y: q32_16 }
relation ChildOf { offset_x: q32_16, offset_y: q32_16 };
phase Update

// 親の位置 + リレーションオフセットにアクセス
system ApplyOffset in Update {
    foreach (pos: write Pos, parent_pos: read Pos via ChildOf) {
        pos.x = parent_pos.x + ChildOf.offset_x;
        pos.y = parent_pos.y + ChildOf.offset_y;
    }
}

// エンティティがリレーションを持つかチェック
system OrphanCheck in Update {
    foreach (pos: write Pos) {
        if (has_relation(ChildOf)) {
            pos.x += 1_q;
        }
    }
}
`}},scene:{category:"Relations & Scenes",title:{en:"Scene System",ja:"シーンシステム"},source:{en:`// Scenes manage game states (title, gameplay, pause, etc.).
// Systems can be filtered to run only in specific scenes.

component Pos { x: q32_16, y: q32_16 }
scene Title;
scene Gameplay;
scene Paused;
phase Update

// Only runs when Title scene is active
system TitleAnimation in Update for Title {
    foreach (pos: write Pos) {
        pos.y += 1.0_q;
    }
}

// Only runs when Gameplay scene is active
system GameLogic in Update for Gameplay {
    foreach (pos: write Pos) {
        pos.x += 1.0_q;
    }
}

// Runs in both Gameplay and Paused scenes
system UIUpdate in Update for Gameplay, Paused {
    foreach (pos: read Pos) {
        var screen_x = pos.x;
    }
}
`,ja:`// シーンはゲーム状態（タイトル、ゲームプレイ、ポーズ等）を管理します。
// システムは特定のシーンでのみ実行するようフィルタできます。

component Pos { x: q32_16, y: q32_16 }
scene Title;
scene Gameplay;
scene Paused;
phase Update

// Title シーンがアクティブな時のみ実行
system TitleAnimation in Update for Title {
    foreach (pos: write Pos) {
        pos.y += 1.0_q;
    }
}

// Gameplay シーンがアクティブな時のみ実行
system GameLogic in Update for Gameplay {
    foreach (pos: write Pos) {
        pos.x += 1.0_q;
    }
}

// Gameplay と Paused の両方で実行
system UIUpdate in Update for Gameplay, Paused {
    foreach (pos: read Pos) {
        var screen_x = pos.x;
    }
}
`}},scene_lifecycle:{category:"Relations & Scenes",title:{en:"Scene Lifecycle",ja:"シーンライフサイクル"},source:{en:`// on_enter / on_exit modifiers run systems once during transitions.

component Pos { x: q32_16, y: q32_16 }
component Score { value: q32_16 }
scene Title;
scene Gameplay;
phase Update

// Runs once when entering Gameplay
system InitGame in Update for Gameplay on_enter {
    foreach (pos: write Pos) {
        pos.x = 0_q;
        pos.y = 0_q;
    }
}

// Runs once when entering Gameplay
system ResetScore in Update for Gameplay on_enter {
    foreach (s: write Score) {
        s.value = 0_q;
    }
}

// Normal gameplay logic
system GameLoop in Update for Gameplay {
    foreach (pos: write Pos) {
        pos.x += 1_q;
    }
}
`,ja:`// on_enter / on_exit 修飾子でシーン遷移時に1回だけ実行します。

component Pos { x: q32_16, y: q32_16 }
component Score { value: q32_16 }
scene Title;
scene Gameplay;
phase Update

// Gameplay に入った時に1回だけ実行
system InitGame in Update for Gameplay on_enter {
    foreach (pos: write Pos) {
        pos.x = 0_q;
        pos.y = 0_q;
    }
}

// Gameplay に入った時にスコアをリセット
system ResetScore in Update for Gameplay on_enter {
    foreach (s: write Score) {
        s.value = 0_q;
    }
}

// 通常のゲームプレイロジック
system GameLoop in Update for Gameplay {
    foreach (pos: write Pos) {
        pos.x += 1_q;
    }
}
`}},constants:{category:"Advanced",title:{en:"Constants",ja:"定数"},source:{en:`// User-defined constants and built-in math constants.

// User constants
const MAX_SPEED = 10_q;
const FRICTION = 0.95_q;
const GRAVITY = 9_q;

component Phys { vx: q32_16, vy: q32_16, angle: q32_16 }
phase Update

system Physics in Update {
    foreach (p: write Phys) {
        // User constants
        p.vy = p.vy + GRAVITY;
        p.vx = p.vx * FRICTION;

        // Built-in math constants: pi, tau, euler, phi, sqrt2, sqrt3
        p.angle = p.angle + pi * 0.01_q;

        // Clamp speed using user constant
        if (p.vx > MAX_SPEED) {
            p.vx = MAX_SPEED;
        }
    }
}
`,ja:`// ユーザー定義定数と組み込み数学定数。

// ユーザー定数
const MAX_SPEED = 10_q;
const FRICTION = 0.95_q;
const GRAVITY = 9_q;

component Phys { vx: q32_16, vy: q32_16, angle: q32_16 }
phase Update

system Physics in Update {
    foreach (p: write Phys) {
        // ユーザー定数の使用
        p.vy = p.vy + GRAVITY;
        p.vx = p.vx * FRICTION;

        // 組み込み数学定数: pi, tau, euler, phi, sqrt2, sqrt3
        p.angle = p.angle + pi * 0.01_q;

        // ユーザー定数で速度制限
        if (p.vx > MAX_SPEED) {
            p.vx = MAX_SPEED;
        }
    }
}
`}},conditionals:{category:"Advanced",title:{en:"Conditional Logic",ja:"条件分岐"},source:{en:`// If/else statements and compound assignment operators.

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
state Moving;
state Grounded;
phase Update

system Movement in Update {
    foreach (pos: write Pos, vel: write Velocity, has Moving) {
        // Compound assignments: +=, -=, *=
        pos.x += vel.dx;
        pos.y += vel.dy;

        // If/else logic
        if (pos.y < 0.0_q) {
            pos.y = 0.0_q;
            vel.dy = 0.0_q;
            entity.add(Grounded);
        } else {
            // Apply gravity
            vel.dy -= 0.5_q;
        }
    }
}
`,ja:`// if/else 文と複合代入演算子。

component Pos { x: q32_16, y: q32_16 }
component Velocity { dx: q32_16, dy: q32_16 }
state Moving;
state Grounded;
phase Update

system Movement in Update {
    foreach (pos: write Pos, vel: write Velocity, has Moving) {
        // 複合代入: +=, -=, *=
        pos.x += vel.dx;
        pos.y += vel.dy;

        // if/else ロジック
        if (pos.y < 0.0_q) {
            pos.y = 0.0_q;
            vel.dy = 0.0_q;
            entity.add(Grounded);
        } else {
            // 重力を適用
            vel.dy -= 0.5_q;
        }
    }
}
`}},todo_holes:{category:"Advanced",title:{en:"Todo Typed Holes",ja:"Todo 型付きホール"},source:{en:`// todo() marks unfinished code that still type-checks.
// The compiler tracks todos and warns about them.

component AI { target_x: q32_16, target_y: q32_16 }
component Pos { x: q32_16, y: q32_16 }
phase Update

fn find_nearest_target(x: q32_16, y: q32_16) -> q32_16 {
    // todo() acts as a typed placeholder
    return todo("implement spatial query");
}

system AIDecision in Update {
    foreach (ai: write AI, pos: read Pos) {
        var dist = find_nearest_target(pos.x, pos.y);
        ai.target_x = pos.x;
    }
}
`,ja:`// todo() は型チェックを通る未完成コードのマーカーです。
// コンパイラは todo を追跡して警告します。

component AI { target_x: q32_16, target_y: q32_16 }
component Pos { x: q32_16, y: q32_16 }
phase Update

fn find_nearest_target(x: q32_16, y: q32_16) -> q32_16 {
    // todo() は型付きプレースホルダーとして機能
    return todo("implement spatial query");
}

system AIDecision in Update {
    foreach (ai: write AI, pos: read Pos) {
        var dist = find_nearest_target(pos.x, pos.y);
        ai.target_x = pos.x;
    }
}
`}}},t=["ECS Basics","Type System","Math","Game Patterns","Relations & Scenes","Advanced"],a="hello";export{a as DEFAULT_EXAMPLE,e as EXAMPLES,t as EXAMPLE_CATEGORIES};
