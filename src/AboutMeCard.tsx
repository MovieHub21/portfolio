export default function AboutMeCard() {
  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl">
          💻
        </div>
      </div>

      {/* Name */}
      <h2 className="mt-4 text-center text-2xl font-bold">
        Marvellous
      </h2>

      {/* Title */}
      <p className="text-center text-sm opacity-90">
        Web Developer
      </p>

      {/* About */}
      <p className="mt-4 text-center text-sm leading-relaxed">
        I build clean, fast, and fun web experiences.
        I love turning ideas into interactive products
        and writing code that actually makes sense 😄.
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <span className="px-3 py-1 bg-white/20 rounded-full">React</span>
        <span className="px-3 py-1 bg-white/20 rounded-full">Tailwind</span>
        <span className="px-3 py-1 bg-white/20 rounded-full">Laravel</span>
        <span className="px-3 py-1 bg-white/20 rounded-full">MySql</span>
      </div>
    </div>
  );
}