/**
 * 按当前 knowledge-points.json 重算相似/冲突缓存并写入 data/analysis-cache.json。
 * Vercel 只读，必须把匹配 539 条的缓存提交进 Git，/library 才不会超时。
 *
 * 运行：npx tsx scripts/warm-analysis-cache.ts
 */
import { getKnowledgePoints } from "../src/lib/storage";
import { hashKnowledgePoints, warmAnalysisCache } from "../src/lib/analysis-cache";

async function main() {
  const points = await getKnowledgePoints();
  const result = await warmAnalysisCache();
  console.log(
    JSON.stringify(
      {
        points: points.length,
        hash: hashKnowledgePoints(points),
        cached: result.cached,
        withSimilar: result.stats.withSimilar,
        contentConflicts: result.stats.contentConflicts,
        conflictGroups: result.stats.conflictGroups,
        computedAt: result.computedAt,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
