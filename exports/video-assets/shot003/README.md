# 分镜 003 画面（16:9）

时间轴三张图用指定素材，不要换成期刊封面或假实验室照片。

源文件在 `user-source/`：

1. `lilly-early-tank.jpg` — 早期箱式隔离舱（图一）
2. `suedfeld-1980-cover.jpg` — Suedfeld 1980 Wiley 书封（图二，contain 不裁 REST）
3. `eeg-video-frame0.jpg` — 研究视频首帧：漂浮中脑电/生理监测（图三）

建议顺序：

1. `003a-chapter-card.jpg` 约 2.5 秒
2. `003b-timeline-01.jpg` → `02` → `03` 三点依次点亮
3. 需要体量时切全幅解释卡：
   - `003c-1950s.jpg` — 1950s　隔离舱实验／John C. Lilly 与早期箱式漂浮舱
   - `003d-1980-book.jpg` — 1970–80s　被定名为 REST／Suedfeld 1980 专著把 REST 写进书名
   - `003e-eeg-frame.jpg` — 2010s–　临床与影像研究／漂浮中的脑电与生理监测

底部统一：「限制性环境刺激疗法 · 先有研究，后发展成疗法」

成片第三节点可用运动画面：`003e-eeg-overlay.mp4`（原研究视频叠上述中文；`BR` / `γβθα` 已在原片中）。重出：`python3 scripts/overlay-shot003-eeg-video.py`

附录（不要替代上面三张）：`003d-naming-events.jpg`、`003e-clinical-imaging.jpg`

重新出图：`python3 scripts/compose-shot003-stills.py`
