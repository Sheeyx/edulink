export default function CourseMedia({
  title,
  imageSrc,
  videoSrc,
}: {
  title: string;
  imageSrc?: string;
  videoSrc?: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border">
      {videoSrc ? (
        <video controls className="w-full h-[340px] bg-black">
          <source src={videoSrc} />
        </video>
      ) : (
        <img src={imageSrc ?? "/images/courses/placeholder.jpg"} alt={title} className="w-full h-[340px] object-cover" />
      )}
    </div>
  );
}
