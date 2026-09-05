/**
 * Dreampad / Intrasound 专利号核验 + 骨传导漂浮枕立案评估。
 * 先案 PAT-PRI-092～095，打掉 PAT-IDEA-061；补写 PAT-PRI-081。
 * 幂等。运行：node scripts/apply-patent-dreampad-pillow.mjs
 */
import { openStore } from "./lib/patent-store.mjs";

const BATCH = {
  batchId: "SRC-PAT-DREAMPAD-PILLOW",
  srcFile: "Dreampad骨传导枕-公开拆解与漂浮枕评估",
  author: "Dreampad/Intrasound专利号核验+漂浮枕评估 2026-09-05（公开检索，未核验法律状态）",
  now: "2026-09-05T10:00:00.000Z",
  guardId: "PAT-IDEA-061",
  note: "核验 Dreampad 宣称的 Intrasound 专利号（US8317734、US11528547 等）；评估骨传导漂浮枕：产品可做密封护颈枕配件，专利按迷走/副交感/漂浮专用枕头打掉。",
};

const store = openStore(BATCH);

store.add({
  id: "PAT-PRI-092",
  kind: "retrieved",
  cluster: "3",
  risk: "critical",
  lifecycle: "active",
  group: "none",
  loc: "US8317734 骨传导垫",
  publicationNo: "US8317734B1",
  jurisdiction: "美国",
  techBranch: "骨传导",
  tags: ["骨传导", "振动枕", "Dreampad", "红灯"],
  title: "US8317734 已授权：柔性垫外套里夹一只骨传导换能器，100–4000 Hz，传到人的骨骼，枕头是实施例",
  summary:
    "「枕头里装骨导换能器、把头骨振到内耳」不是空白。这就是 Unyte 自己点名的那件 Intrasound 专利。",
  body:
    "公开要点：US8317734B1（申请 12/456,625，2009-06-19 申请，2012-11-27 授权；权利人 Integrated Listening Systems, LLC；发明人 Randall Redfield）。独权：柔性垫 + 完全包住的外套 + 骨传导换能器贴着外套、位于垫的上表面与外套之间；换能器发 100–4000 Hz，经骨传导刺激人的前庭/耳蜗；声源电连接；垫和外套配置成能把声波传到骨骼。说明书把垫写成床面、毯子或枕头；换能器坐在泡沫凹槽里；可用玻璃珠一类硬颗粒扩大传导面积；线与声源收在外套口袋。Unyte 专利页 https://integratedlistening.com/about/patents/ 只挂这一件。Google Patents 标有效至约 2031-03-29，法律状态待代理师核验。\n\n对我们的限制：不得主张枕头、垫、毯子里嵌骨传导换能器；不得主张 100–4000 Hz 骨导传到颅骨或内耳；不得主张换能器夹在填料和外套之间这种安装。漂浮舱只是换了液体环境，结构还是这一件。\n\n法律状态与权项范围待核验。本卡为公开检索结果，不构成正式法律意见。",
  relatedIds: ["PAT-INDEX-001", "PAT-PRI-081", "PAT-IDEA-053", "PAT-IDEA-061"],
});

store.add({
  id: "PAT-PRI-093",
  kind: "retrieved",
  cluster: "3",
  risk: "critical",
  lifecycle: "active",
  group: "none",
  loc: "US11528547 整面共振垫",
  publicationNo: "US11528547B2",
  jurisdiction: "美国",
  techBranch: "骨传导",
  tags: ["骨传导", "振动枕", "Dreampad", "整面共振", "红灯"],
  title: "US11528547 已授权给 Dreampad LLC：垫内换能器 50–4000 Hz，整张垫子上表面共振，可塞到枕头下面",
  summary:
    "后续件比 2012 年那件更宽：不要求对准某块骨头，整面共振；无线接收器可以放在外套口袋。",
  body:
    "公开要点：US11528547B2（17/076,598，2020-10-21 申请，2022-12-13 授权；权利人 Dreampad LLC；发明人 Redfield、Renner）。优先权链回到 2009-06-19 的 12/456,625。独权：垫内骨传导换能器发 50–4000 Hz；换能器耦合到垫上，使声波在整个上表面共振；声源供信号。从权含三层叠层、前庭刺激、无线接收、外套口袋装接收器。摘要写明垫可放在枕头或床垫下面。续案 US20230108706A1 仍在同族。Google Patents 标有效至约 2029-11-13。\n\n对我们的限制：不得主张「垫子整面把骨导振开、头压在哪都算数」；不得主张 50–4000 Hz 这一档；不得主张枕下薄垫（Aurras 那种形态）。漂浮护颈枕如果也是「芯材里灌封振子、整面把振传到后脑」，和独权是同一结构，只是外套换成 TPU。\n\n法律状态待核验。本卡为公开检索结果，不构成正式法律意见。",
  relatedIds: ["PAT-INDEX-001", "PAT-PRI-081", "PAT-PRI-092", "PAT-IDEA-061"],
});

store.add({
  id: "PAT-PRI-094",
  kind: "retrieved",
  cluster: "5",
  risk: "high",
  lifecycle: "active",
  group: "none",
  loc: "US10112029 治疗方法和骨导垫",
  publicationNo: "US10112029B2",
  jurisdiction: "美国",
  techBranch: "骨传导",
  tags: ["骨传导", "治疗方法", "第25条", "红灯"],
  title: "US10112029 把气导/骨导耳机加过滤音乐写成治疗方法，说明书里枕头垫子又写了一遍",
  summary:
    "效果和治疗方案本来就不能在中国当独权。说明书还是同一套骨导垫，挡的是「我们换个适应症再写一遍」。",
  body:
    "公开要点：US10112029B2（2013-03-15 申请，2018-10-30 授权；权利人 Integrated Listening Systems；发明人 Redfield、Minson）。独权是对多名受试者的感觉统合治疗方法：评估缺陷、过滤音乐、房间气导喇叭一路、无线气导/骨导耳机一路、再做平衡和眼动练习。说明书单独用大段文字描述柔性骨导垫（枕、床、头带、眼罩、婴儿垫），低频为主，约 50–1000 Hz，以及 Tomatis 式频段划分。\n\n对我们的限制：不得把骨导振动写成改善注意、发育、睡眠或自主神经的方法；中国专利法第 25 条下治疗方法本就不授权（PAT-RULE-004）。装置部分与 734/547 重叠，不能靠换适应症绕开。\n\n法律状态待核验。本卡为公开检索结果，不构成正式法律意见。",
  relatedIds: ["PAT-INDEX-001", "PAT-RULE-004", "PAT-PRI-092", "PAT-IDEA-059", "PAT-IDEA-061"],
});

store.add({
  id: "PAT-PRI-095",
  kind: "retrieved",
  cluster: "3",
  risk: "high",
  lifecycle: "active",
  group: "none",
  loc: "US10751503 Head Spot 骨导枕",
  publicationNo: "US10751503B2",
  jurisdiction: "美国 / 商业公开使用",
  techBranch: "骨传导",
  tags: ["骨传导", "振动枕", "竞品", "红灯"],
  title: "另一家已经授权并在卖骨传导枕：US10751503，50–4000 Hz，换能器可换位，商品名 Head Spot",
  summary:
    "骨导枕不是 Dreampad 一家。再做一只「漂浮版枕头」连差异化都谈不上。",
  body:
    "公开要点：US10751503B2（权利人 KARE, LLC；发明人 Philip Root）。独权：柔性外套 + 填料 + 多只可换位骨传导换能器放在外套和填料之间的口袋里；无线发射到换能器；USB 供电。从权写枕头形态、50–4000 Hz。商品 Head Spot 公开销售，文案写振动经颅骨到内耳，并用于助眠/耳鸣管理。\n\n对我们的限制：不得主张「可换位的枕内骨导换能器」或「枕头形态的骨导体感装置」本身。与 Dreampad 专利并行存在，说明这一产品形态在美国已有多家布局。\n\n法律状态待核验。本卡为公开检索结果，不构成正式法律意见。",
  relatedIds: ["PAT-INDEX-001", "PAT-PRI-081", "PAT-PRI-092", "PAT-IDEA-061"],
});

store.add({
  id: "PAT-IDEA-061",
  kind: "layout",
  cluster: "5",
  risk: "critical",
  lifecycle: "killed",
  group: "none",
  loc: "骨传导漂浮枕",
  tags: ["已打掉", "骨传导", "振动枕", "迷走", "第25条"],
  techBranch: "迷走神经调节",
  title: "已打掉：漂浮舱骨传导枕头把振动经颅骨传到内耳以激活副交感或迷走",
  summary:
    "产品可以做密封护颈枕配件。专利不能写枕头激活副交感，也不能靠「用在漂浮舱里」变成新发明。",
  body:
    "打掉原因，四条。\n\n一，客体。经颅骨到内耳、刺激迷走、激活副交感、助眠，属于对人体的方法或科学发现，专利法第 25 条不予授权。厂家自己已经把这套话写在帮助页和经销页上（PAT-PRI-081）。第五簇独权不写刺激与激活（PAT-CLU-005）。音疗已打掉（PAT-IDEA-059）。\n\n二，装置是现有技术。US8317734 独权就是外套里夹骨导换能器、100–4000 Hz、传到骨骼，枕头是实施例（PAT-PRI-092）。US11528547 把频段扩到 50–4000 Hz，并主张整张垫子上表面共振、可放在枕下（PAT-PRI-093）。US10112029 把骨导写成治疗方法（PAT-PRI-094）。另一家 US10751503 / Head Spot 同样在卖骨导枕（PAT-PRI-095）。Dreampad 商品、Shark Tank、官网从 2010 年代起公开使用（PAT-RULE-006）。\n\n三，去环境测试失败。拿掉高盐和中性浮力，床上或浴缸里放一只骨导枕，结构还在。漂浮业已有无振子护颈枕（Dreampod Halo Float Pillow）和防水骨传导耳机（PAT-PRI-090）。「漂浮舱 + 骨导枕」是已知头枕加已知振子，属简单叠加（PAT-RULE-005）。\n\n四，解剖对不上。枕头贴枕骨/后脑，骨导走耳蜗和前庭，不是迷走耳支。耳甲艇/耳屏才能打 ABVN。频率不能把能量分配给迷走。双通道迷走主张已打掉（PAT-IDEA-060）。舱内换能器和骨传导放松入口已打掉（PAT-IDEA-053）。\n\n不建议投入。产品侧头通道用防水骨传导耳机；不爱戴耳机的人可以做密封 TPU 护颈枕配件，验收只测后脑微振，不测 HRV。方案见 patent-drafts/Dreampad骨传导枕-公开拆解与漂浮枕评估.md 第 4 节，以及 docs/双通道微振-产品研发方案.md。组三可写的仍是高盐耦合与腔体模态（PAT-IDEA-049、050），不要借枕头重写。\n\n可以改写的落点：无。灌封、12 V、可洗外套是常规湿区电器。测乳突做串扰抵消属已知前馈，且骨导 ANC 已有 PAT-PRI-073。",
  examples: [
    "错：一种漂浮舱骨传导枕头，经颅骨将振动传至内耳以刺激迷走神经并激活副交感",
    "错：说明书把 Intrasound、40Hz、音疗当实施例",
    "对：产品做密封护颈枕或骨传导耳机，专利文件不出现本概念",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-RULE-004",
    "PAT-RULE-005",
    "PAT-CLU-005",
    "PAT-IDEA-053",
    "PAT-IDEA-060",
    "PAT-PRI-081",
    "PAT-PRI-092",
    "PAT-PRI-093",
    "PAT-PRI-094",
    "PAT-PRI-095",
    "PAT-PRI-090",
  ],
});

store.patch("PAT-PRI-081", {
  publicationNo:
    "US8317734B1；US11528547B2；非专利公开：Dreampad 骨传导振动枕（Intrasound）官网/帮助页/Shark Tank",
  jurisdiction: "美国专利 + 商业公开使用",
});

store.append(
  "PAT-PRI-081",
  "【2026-09-05 专利号核验】",
  "Unyte 专利页点名 US8317734B1（Bone conduction pad，2012 授权）。同族后续 US11528547B2 授权给 Dreampad LLC（50–4000 Hz，整面共振）。帮助页原文写振动声刺激迷走、激活副交感。详细拆解与漂浮枕评估见 patent-drafts/Dreampad骨传导枕-公开拆解与漂浮枕评估.md。另有竞品 US10751503B2。本卡不再写「专利号待核验」。"
);

store.append(
  "PAT-INDEX-001",
  "【2026-09-05 Dreampad 枕补注】",
  "新增红灯：漂浮舱骨传导枕头经颅骨到内耳以激活副交感/迷走（PAT-IDEA-061）。先案补公开号 US8317734、US11528547、US10112029、US10751503（PAT-PRI-092～095）；PAT-PRI-081 已核到专利号。产品可做密封护颈枕配件，专利不写。评估见 patent-drafts/Dreampad骨传导枕-公开拆解与漂浮枕评估.md。"
);

store.append(
  "PAT-MAP-007",
  "【2026-09-05 Dreampad 枕补注】",
  "定稿后补检索：PAT-PRI-092～095 与红灯 PAT-IDEA-061。不改 v4.0 技术路线。完整表见专利整合方案-v4.md 文末补录。"
);

store.commit();
