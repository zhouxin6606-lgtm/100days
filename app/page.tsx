import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/20 dark:via-zinc-950 dark:to-zinc-950">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            学习打卡
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              进入仪表盘
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                登录
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                免费注册
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mb-6 block text-7xl">📚</span>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-6xl">
            记录每一天的
            <span className="text-emerald-600 dark:text-emerald-400"> 学习 </span>
            进步
          </h1>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            与伙伴互相监督，共同成长。用数据见证你的坚持，用打卡养成好习惯。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-600 px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              🚀 开始你的打卡之旅
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-lg font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              了解更多 ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 text-4xl">🔥</div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">128</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">连续打卡天数</div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 text-4xl">⏱️</div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">2,048</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">累计学习分钟</div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 text-4xl">👥</div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">56</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">学习小组成员</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            为什么选择学习打卡？
          </h2>
          <p className="mb-12 text-center text-zinc-600 dark:text-zinc-400">
            我们提供最简洁高效的学习追踪体验
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl dark:bg-emerald-900/30">
                ✅
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  一键打卡
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  选择学习时长，添加笔记，一键完成打卡。简单高效，不浪费时间。
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl dark:bg-orange-900/30">
                🔥
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  连续打卡
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  追踪连续打卡天数，打破记录，养成持久的学习习惯。
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-900/30">
                📊
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  热力图
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  GitHub 风格的年度热力图，一眼看到你的学习轨迹。
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl dark:bg-purple-900/30">
                👥
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  小组监督
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  创建或加入学习小组，实时查看成员打卡动态，互相监督。
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-2xl dark:bg-yellow-900/30">
                🏆
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  成就系统
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  解锁成就徽章，提升等级，让学习更有成就感。
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-pink-100 text-2xl dark:bg-pink-900/30">
                ⚡
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
                  实时动态
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  小组成员打卡实时推送，第一时间看到伙伴的学习动态。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-emerald-600 px-8 py-16 text-center dark:bg-emerald-700">
          <h2 className="mb-4 text-3xl font-bold text-white">
            准备好开始了吗？
          </h2>
          <p className="mb-8 text-emerald-100">
            加入数千名学习者，用打卡记录你的成长
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-lg font-medium text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
          >
            免费注册，立即开始
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>📚 学习打卡 — 记录每一天的进步</p>
        </div>
      </footer>
    </div>
  );
}
