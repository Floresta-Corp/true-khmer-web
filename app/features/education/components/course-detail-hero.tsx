interface CourseDetailHeroProps {
  title: string;
  coverImageUrl: string | null;
}

export function CourseDetailHero({
  title,
  coverImageUrl,
}: CourseDetailHeroProps) {
  return (
    <div className="relative mb-6 h-[280px] overflow-hidden rounded-xl bg-[#E8E8E8] sm:h-[460px]">
      <img
        src={coverImageUrl ?? "/placeholder/images.svg"}
        alt=""
        className="size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,20,28,0.82)_0%,rgba(18,20,28,0.45)_45%,rgba(18,20,28,0.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 px-6 pt-8 pb-7 sm:px-7.5 sm:pb-7.5">
        <h1 className="line-clamp-2 text-2xl leading-[1.1] font-extrabold text-white sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
