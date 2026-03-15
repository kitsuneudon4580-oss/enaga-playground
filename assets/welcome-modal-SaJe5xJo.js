import{s as i}from"./index-CtVSfVG6.js";import"./monaco-editor-BevPwV2U.js";import"./pako-CZODfnBq.js";const r={en:{title:"Welcome to Enaga Playground",subtitle:"An ECS-first programming language that compiles to C",features:[["Fixed-Point Arithmetic","Deterministic q32_16 math — no floating-point surprises"],["ECS by Design","Components, systems, phases, and relations as language primitives"],["SIMD Auto-Vectorization","7-tier dispatch: AVX-512 → NEON → WASM SIMD"],["Compile to C","Generates portable C11 code from high-level ECS logic"]],tryExample:"Try an Example",startCoding:"Start Coding"},ja:{title:"Enaga Playground へようこそ",subtitle:"C言語にコンパイルされる ECS 特化プログラミング言語",features:[["固定小数点演算","決定的な q32_16 演算 — 浮動小数点の問題なし"],["ECS ファースト設計","コンポーネント・システム・フェーズ・リレーションが言語プリミティブ"],["SIMD 自動ベクトル化","7段階ディスパッチ: AVX-512 → NEON → WASM SIMD"],["C 言語へコンパイル","高レベル ECS ロジックからポータブルな C11 コードを生成"]],tryExample:"サンプルを試す",startCoding:"コーディング開始"}};function d(){const e=document.createElement("div");e.className="welcome-overlay",e.style.display="none";const a=document.createElement("div");a.className="welcome-panel";function l(){const o=i.get().language==="ja"?"ja":"en",t=r[o];a.innerHTML=`
      <h2>${t.title}</h2>
      <p class="welcome-subtitle">${t.subtitle}</p>
      <ul class="welcome-features">
        ${t.features.map(([n,s])=>`<li><strong>${n}</strong><span>${s}</span></li>`).join("")}
      </ul>
      <div class="welcome-actions">
        <button class="welcome-btn welcome-btn--primary" data-action="example">${t.tryExample}</button>
        <button class="welcome-btn" data-action="close">${t.startCoding}</button>
      </div>
    `,a.querySelectorAll(".welcome-btn").forEach(n=>{n.addEventListener("click",()=>{e.style.display="none",n.dataset.action==="example"&&document.getElementById("example-selector")?.focus()})})}return l(),i.on("language",()=>l()),e.appendChild(a),e.addEventListener("click",o=>{o.target===e&&(e.style.display="none")}),e}export{d as createWelcomeModal};
