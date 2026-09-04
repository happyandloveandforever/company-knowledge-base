/**
 * 校验正在运行的服务是不是最新编译产物。
 *
 * 为什么需要：卡片正文是每次请求读 data/*.json 的，永远新鲜；
 * 用 grep 卡片内容来验证界面，无法区分 bundle 是新是旧。
 * 这里只检查那些「只可能来自 React 组件编译结果」的标记。
 *
 * 用法：node scripts/check-served-ui.mjs [url]
 * 退出码非 0 表示服务是旧的，需要 npm run build 后重启 next-server。
 */
const url = process.argv[2] ?? "http://127.0.0.1:43123/patents";

// 这些字符串只出现在 patents-client.tsx 的编译结果里，不出现在任何卡片正文中。
const MARKERS = [
  { needle: 'value="g5"', why: "申请组下拉缺少组五选项" },
  { needle: "独权候选 PAT-IDEA-055", why: "组五统计卡未渲染" },
  { needle: "独权候选 PAT-ROAD-A", why: "组一统计卡未渲染" },
  { needle: "保留做决策留痕", why: "已取代提示行未渲染" },
  { needle: "只看现行", why: "生命周期快捷按钮未渲染" },
];

const res = await fetch(url).catch((e) => {
  console.error(`取不到页面：${e.message}`);
  process.exit(2);
});
if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  process.exit(2);
}
const html = await res.text();

const missing = MARKERS.filter((m) => !html.includes(m.needle));
for (const m of MARKERS) {
  console.log(`${missing.includes(m) ? "FAIL" : "PASS"} ${m.needle}${missing.includes(m) ? ` — ${m.why}` : ""}`);
}

if (missing.length) {
  console.error(
    `\n服务跑的是旧编译产物。修法：npm run build 后 kill $(pgrep -f next-server | head -1)，守护进程会用新产物拉起。`
  );
  process.exit(1);
}
console.log(`\n服务已是最新界面产物（${url}）。`);
